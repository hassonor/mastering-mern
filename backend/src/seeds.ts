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
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'normal 80px sans-serif';
    ctx.fillStyle = foregroundColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL();
}

async function seedUserData(count: number): Promise<void> {
    const usedUsernames = new Set();

    try {
        for (let i = 0; i < count; i++) {
            let username = faker.word.adjective(8);

            // Ensure uniqueness of the username
            while (usedUsernames.has(username)) {
                username = faker.word.adjective(8);
            }

            usedUsernames.add(username);

            const color = avatarColor();
            const avatar = generateAvatar(username.charAt(0).toUpperCase(), color);

            const body = {
                username,
                email: faker.internet.email(),
                password: 'somerandompassword2',
                avatarColor: color,
                avatarImage: avatar
            };

            console.log(`**** ADDING USER TO DATABASE*** - ${i + 1} - ${count} - ${username}`);
            await axios.post(`${process.env.API_URL}/signup`, body);

        }
    } catch (err: any) {
        console.log(err?.response?.data);
    }
}


seedUserData(10);
