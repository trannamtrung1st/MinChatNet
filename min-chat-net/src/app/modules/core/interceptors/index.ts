import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { RequestTokenInterceptor } from './request-token.interceptor';

/** Http interceptor providers in outside-in order */
export const HTTP_INTERCEPTOR_PROVIDERS = [
  { provide: HTTP_INTERCEPTORS, useClass: RequestTokenInterceptor, multi: true }
];
