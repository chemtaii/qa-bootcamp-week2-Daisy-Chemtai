type User = {
    readonly id: number,
    username: string,
    settings?: {
        notifications?: boolean,
    },
    retire: (date: Date) => void
}
//Notifications set
let user1 : User = {
    id : 1, 
    username:'Daisy',
    settings: {
        notifications: true
    },
    retire: (date: Date) => {
        console.log(date)
    }
};

//no settings
let user2 : User = {
    id : 2, 
    username:'Chemakike',
    retire: (date: Date) => {
        console.log(date)
    }
};

//Settings but no notifications
let user3 : User = {
    id : 3, 
    username:'Chemtai',
    settings: {},
    retire: (date: Date) => {
        console.log(date)
    }
};

function isNotified(user: User): boolean {
    return user.settings?.notifications ?? false;
}

console.log("User 1:", isNotified(user1));
console.log("User 2:", isNotified(user2));
console.log("User 3:", isNotified(user3));

export {};

