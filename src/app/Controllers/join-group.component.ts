import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'sweetalert';
import { ApiService } from '../Services/ApiService';
import { debounceTime, distinctUntilChanged, switchMap, filter, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs/';
import { Conversation } from '../Models/Conversation';

@Component({
    templateUrl: '../Views/join-group.html',
    styleUrls: [
        '../Styles/add-friend.css',
        '../Styles/menu.css'
    ]
})
export class JoinGroupComponent implements OnInit {
    public groups: Observable<Conversation[]> = new Observable<Conversation[]>();
    private searchTerms = new Subject<string>();

    constructor(
        private apiService: ApiService,
        private router: Router) {
    }

    public ngOnInit(): void {
        this.groups = this.searchTerms.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            filter(term => term.length >= 3),
            switchMap(term => this.apiService.SearchGroup(term)),
            map(t => t.items)
        );
    }

    public search(term: string): void {
        this.searchTerms.next(term);
    }

    public joinGroup(groupName: string) {
        this.apiService.JoinGroup(groupName).subscribe((response) => {
            if (response.code === 0) {
                this.router.navigate(['/']);
            } else {
                swal('Try again', response.message, 'error');
            }
        });
    }
}
