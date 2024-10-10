const users = [
    {
        username: 'alice_jones',
        email: 'alice@email.com'
    },
    {
        username: 'john_doe',
        email: 'John@email.com'
    },
    {
        username: 'charlie_brown',
        email: 'charlie@email.com'
    }
];

const thoughts = [
    {
        thoughtText: 'I am learning how to code and I love it!',
        username: 'alice_jones',
        reactions: [
            {
                reactionBody: 'That is amazing! 👍',
                username: 'John_doe',
            },
            {
                reactionBody: '❤️',
                username: 'charlie_brown',
            }
        ]
    },
    {
        thoughtText: 'Just finished my second project and it feels great!',
        username: 'John_doe',
        reactions: [
            {
                reactionBody: 'Great job! 👍',
                username: 'alice_jones',
            },

        ]
    },
    {
        thoughtText: 'There is so much to learn because coding is constantly evolving!',
        username: 'charlie_brown',
        reactions: [
            {
                reactionBody: 'Keep it up! 👍',
                username: 'John_doe',
            },
            {
                reactionBody: 'You got this! 💪',
                username: 'alice_jones',
            }
        ]
    },
];

export { users, thoughts };
