import Mail from '@services/Mail.service';
import { Job, DoneCallback } from 'bee-queue';

class UserWelcomeMailJob {
  get key() {
    return 'UserWelcomeMail';
  }

  async handle(job: Job): Promise<void> {
    const { user } = job.data;

    return await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Seja muito bem vindo',
      template: 'welcome',
      context: {
        name: user.name,
      },
    });
  }
}

export default new UserWelcomeMailJob();
