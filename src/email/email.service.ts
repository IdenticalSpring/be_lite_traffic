import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'; 
import * as handlebars from 'handlebars'; 
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        // Cấu hình transporter
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: +process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    private renderTemplate(templateName: string, context: any): string {
       
        const templatePath = existsSync(join(__dirname, 'templates', `${templateName}.hbs`))
            ? join(__dirname, 'templates', `${templateName}.hbs`) 
            : join(__dirname, '../../src/email/templates', `${templateName}.hbs`); 

        const templateSource = readFileSync(templatePath, 'utf8');
        const compiledTemplate = handlebars.compile(templateSource);
        return compiledTemplate(context);
    }
    async sendMail(to: string, subject: string, templateName: string, context: any) {
        try {
            const html = this.renderTemplate(templateName, context); 
            const info = await this.transporter.sendMail({
                from: `"E-Wedding" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html, // Rendered HTML
            });
            console.log('Email sent:', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}
