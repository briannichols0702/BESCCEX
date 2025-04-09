"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskQueue = void 0;
class TaskQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }
    async add(task) {
        this.queue.push(task);
        if (!this.processing) {
            this.processing = true;
            await this.processQueue();
            this.processing = false;
        }
    }
    async processQueue() {
        while (this.queue.length > 0) {
            const task = this.queue.shift();
            if (task) {
                await task();
            }
        }
    }
}
exports.taskQueue = new TaskQueue();
