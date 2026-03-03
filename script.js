import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '1m', target: 100 },
    { duration: '2m', target: 300 },
    { duration: '2m', target: 600 },
    { duration: '2m', target: 800 },
    { duration: '2m', target: 1000 },
  ],
};

export default function () {
  http.get('http://bs-external-alb-1380757741.ap-northeast-2.elb.amazonaws.com/api/boards');
  sleep(1);
}