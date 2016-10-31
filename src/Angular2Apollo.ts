import { OpaqueToken, Injectable, Inject } from '@angular/core';
import { rxify } from 'apollo-client-rxjs';
import { ApolloClient, ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs/Observable';

import { ApolloQueryObservable } from './ApolloQueryObservable';

import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromPromise';

export const angularApolloClient = new OpaqueToken('AngularApolloClient');
export function defaultApolloClient(client: ApolloClient): any {
  return {
    provide: angularApolloClient,
    useValue: client,
  };
}

@Injectable()
export class Angular2Apollo {
  constructor(
    @Inject(angularApolloClient) private client: any
  ) {}

  public watchQuery(options: any): ApolloQueryObservable<ApolloQueryResult> {
    return new ApolloQueryObservable(rxify(this.client.watchQuery)(options));
  }

  public query(options: any): Observable<ApolloQueryResult> {
    return Observable.fromPromise(this.client.query(options));
  }

  public mutate(options: any): Observable<ApolloQueryResult> {
    return Observable.fromPromise(this.client.mutate(options));
  }

  public subscribe(options: any): Observable<any> {
    if (typeof this.client.subscribe === 'undefined') {
      throw new Error(`Your version of ApolloClient doesn't support subscriptions`);
    }

    return Observable.from(this.client.subscribe(options));
  }
}
