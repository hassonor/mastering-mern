import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { floor, random } from 'lodash';
import axios from 'axios';
import { createCanvas } from 'canvas';

dotenv.config({});

function avatarColor(): string {
    const colors: string[] = [
        '#5FB08E', '#CF9DED', '#C346D3', '#056ECA', '#9A0BCF',
        '#8226F9', '#78F888', '#0B6FD8', '#775AF7', '#F9475D',
        '#DE6BCC', '#C3A907', '#300877', '#A4E147', '#629C73',
        '#09AA6C', '#1187F9', '#A0FCB5', '#C163A7', '#D3B8DC'
    ];

    return colors[floor(random(0.9) * colors.length)];
}

function generateAvatar(text: string, backgroundColor: string, foregroundColor = 'white') {
    const canvas = createCanvas(200, 200);
    const context = canvas.getContext('2d');

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = 'normal 80px sans-serif';
    context.fillStyle = foregroundColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/png');
}

async function seedUserData(count: number): Promise<void> {
    let i = 0;
    try {
        for (i = 0; i < count; i++) {
            const username: string = faker.helpers.unique(faker.word.adjective, [15]);
            const color = avatarColor();
            const avatar = generateAvatar(username.charAt(0).toUpperCase(), color);

            const body = {
                username,
                email: faker.internet.email(),
                password: 'somerandompassword',
                avatarColor: color,
                avatarImage: avatar
            };
            console.log(`***ADDING USER TO DATABASE*** - ${i + 1} of ${count} - ${username}`);
            await axios.post(`${process.env.API_URL}/signup`, body);
        }
    } catch (error: any) {
        console.log(error?.response?.data);
    }
}

seedUserData(10);