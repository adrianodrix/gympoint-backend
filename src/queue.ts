import 'module-alias/register';
import 'dotenv/config';
import Queue from '@services/Queue.service';

Queue.processQueue();
