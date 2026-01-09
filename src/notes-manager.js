import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { userContext } from './user-context.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

class NotesManager {
  constructor() {
    this.notesDir = path.join(ROOT_DIR, 'data', 'notes');
    this.remindersDir = path.join(ROOT_DIR, 'data', 'reminders');
    this.calendarDir = path.join(ROOT_DIR, 'data', 'calendar');
  }

  // Customer Notes (per user)
  async getCustomerNotes(customerId, userId = null) {
    if (!userId) {
      userId = await userContext.getUserId();
    }

    const customerDir = path.join(this.notesDir, customerId);
    const notesFile = path.join(customerDir, `${userId}.md`);

    try {
      return await fs.readFile(notesFile, 'utf-8');
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
  }

  async saveCustomerNotes(customerId, content, userId = null) {
    if (!userId) {
      userId = await userContext.getUserId();
    }

    const customerDir = path.join(this.notesDir, customerId);
    await fs.mkdir(customerDir, { recursive: true });

    const notesFile = path.join(customerDir, `${userId}.md`);
    await fs.writeFile(notesFile, content, 'utf-8');
  }

  async appendCustomerNote(customerId, note, userId = null) {
    if (!userId) {
      userId = await userContext.getUserId();
    }

    const existingNotes = await this.getCustomerNotes(customerId, userId);
    const timestamp = new Date().toISOString();
    const userName = await userContext.getUserName();

    const newNote = `\n## ${timestamp.split('T')[0]} - ${userName}\n\n${note}\n`;

    const content = existingNotes
      ? existingNotes + newNote
      : `# Notater - ${customerId}\n${newNote}`;

    await this.saveCustomerNotes(customerId, content, userId);
  }

  async getAllCustomerNotes(customerId) {
    const customerDir = path.join(this.notesDir, customerId);

    try {
      const files = await fs.readdir(customerDir);
      const noteFiles = files.filter(f => f.endsWith('.md'));

      const notes = await Promise.all(
        noteFiles.map(async (file) => {
          const userId = file.replace('.md', '');
          const content = await fs.readFile(path.join(customerDir, file), 'utf-8');
          return { userId, content };
        })
      );

      return notes;
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }

  // Reminders (per user)
  async getReminders(userId = null) {
    if (!userId) {
      userId = await userContext.getUserId();
    }

    const remindersFile = path.join(this.remindersDir, `${userId}-reminders.json`);

    try {
      const content = await fs.readFile(remindersFile, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }

  async saveReminders(reminders, userId = null) {
    if (!userId) {
      userId = await userContext.getUserId();
    }

    const remindersFile = path.join(this.remindersDir, `${userId}-reminders.json`);
    await fs.writeFile(remindersFile, JSON.stringify(reminders, null, 2), 'utf-8');
  }

  async addReminder(reminder, userId = null) {
    const reminders = await this.getReminders(userId);

    const newReminder = {
      id: Date.now().toString(),
      text: reminder.text,
      dueDate: reminder.dueDate,
      customerId: reminder.customerId || null,
      projectId: reminder.projectId || null,
      completed: false,
      created: new Date().toISOString()
    };

    reminders.push(newReminder);
    await this.saveReminders(reminders, userId);

    return newReminder;
  }

  async completeReminder(reminderId, userId = null) {
    const reminders = await this.getReminders(userId);
    const reminder = reminders.find(r => r.id === reminderId);

    if (reminder) {
      reminder.completed = true;
      reminder.completedAt = new Date().toISOString();
      await this.saveReminders(reminders, userId);
    }

    return reminder;
  }

  async deleteReminder(reminderId, userId = null) {
    const reminders = await this.getReminders(userId);
    const filtered = reminders.filter(r => r.id !== reminderId);
    await this.saveReminders(filtered, userId);
  }

  // Calendar Events (per user)
  async getCalendarEvents(userId = null) {
    if (!userId) {
      userId = await userContext.getUserId();
    }

    const calendarFile = path.join(this.calendarDir, `${userId}-calendar.json`);

    try {
      const content = await fs.readFile(calendarFile, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }

  async saveCalendarEvents(events, userId = null) {
    if (!userId) {
      userId = await userContext.getUserId();
    }

    const calendarFile = path.join(this.calendarDir, `${userId}-calendar.json`);
    await fs.writeFile(calendarFile, JSON.stringify(events, null, 2), 'utf-8');
  }

  async addCalendarEvent(event, userId = null) {
    const events = await this.getCalendarEvents(userId);

    const newEvent = {
      id: Date.now().toString(),
      title: event.title,
      description: event.description || '',
      date: event.date,
      time: event.time || null,
      duration: event.duration || null,
      customerId: event.customerId || null,
      projectId: event.projectId || null,
      type: event.type || 'meeting', // meeting, deadline, call, etc.
      created: new Date().toISOString()
    };

    events.push(newEvent);
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    await this.saveCalendarEvents(events, userId);

    return newEvent;
  }

  async deleteCalendarEvent(eventId, userId = null) {
    const events = await this.getCalendarEvents(userId);
    const filtered = events.filter(e => e.id !== eventId);
    await this.saveCalendarEvents(filtered, userId);
  }

  async getUpcomingEvents(days = 7, userId = null) {
    const events = await this.getCalendarEvents(userId);
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);

    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= future;
    });
  }
}

export const notesManager = new NotesManager();
