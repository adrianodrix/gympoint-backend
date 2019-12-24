import Bee from 'bee-queue';
import Config from '@config';

import UserWelcomeMail from '@modules/Users/jobs/mail/UserWelcomeMail.job';

const jobs = [UserWelcomeMail];

class Queue {
  private queues;

  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: Config.redis,
          prefix: 'bq',
          stallInterval: 5000,
          nearTermWindow: 1200000,
          delayedDebounce: 1000,
          isWorker: true,
          getEvents: true,
          sendEvents: true,
          storeJobs: true,
          ensureScripts: true,
          activateDelayedJobs: false,
          removeOnSuccess: false,
          removeOnFailure: false,
          redisScanCount: 100,
        }),
        handle,
      };
    });
  }

  // Queue.add(UserWelcomeMail.key, { user: newUser });
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee
        .process(handle)
        .on('ready', this.handleReady)
        .on('succeeded', this.handleSuceeded)
        .on('failed', this.handleFailure)
        .on('error', this.handleError);
    });
  }

  handleReady() {
    console.info('QUEUE: Ready, listening ...');
  }

  handleError(err) {
    console.log(`A queue error happened: ${err.message}`);
  }

  handleSuceeded(job, result) {
    console.info(`QUEUE: Job ${job.queue.name} succeeded`, result);
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
