type User = {
    readonly id: number,
    username: string,
    settings?: {
        notifications?: boolean,
    },
}
//Notifications set
const user1 : User = {
    id : 1, 
    username:'Daisy',
    settings: {
        notifications: true
    },
};

//no settings
const user2 : User = {
    id : 2, 
    username:'Chemakike',
};

//Settings but no notifications
const user3 : User = {
    id : 3, 
    username:'Chemtai',
    settings: {}
};

function isNotified(user: User): boolean {
    return user.settings?.notifications ?? false;
}

console.log("User 1:", isNotified(user1));
console.log("User 2:", isNotified(user2));
console.log("User 3:", isNotified(user3));

export {};

