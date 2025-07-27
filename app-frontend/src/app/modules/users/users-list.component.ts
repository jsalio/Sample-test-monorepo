import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserWithoutPwd } from '../../types/app.type';

@Component({
    selector: 'app-users-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.css'],
    providers: [UserService]
})
export class UsersListComponent implements OnInit {
    users: UserWithoutPwd[] = [];

    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.userService.getUsers().subscribe(
            (response) => {
                this.users = response.data;
                console.log('Users fetched successfully:', this.users);
            },
            (error) => {
                console.error('Error fetching users:', error);
            }
        );
    }

    editUser(userId: string): void {
        // Logic to edit user
        console.log('Edit user with ID:', userId);
    }

    deleteUser(userId: string): void {
        // Logic to delete user
        console.log('Delete user with ID:', userId);
    }
}
