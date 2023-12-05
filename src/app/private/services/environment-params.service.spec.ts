import { TestBed } from '@angular/core/testing';

import { EnvironmentParamsService } from './environment-params.service';
import { HttpClientModule } from '@angular/common/http';
import { EnvironmentParams } from '../interfaces/environment-params.interface';
import { environments } from 'src/environments/environments';

describe('EnvironmentParamsService', () => {
  let service: EnvironmentParamsService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(EnvironmentParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('Debe traer los params en metodo getEnvParams', () => {
    const paramsExpect: EnvironmentParams = {} as EnvironmentParams;

    service.getEnvParams().then(params => {
      expect(params).toEqual(paramsExpect)

    })
  })

  test('Debe traer los params en el metodo getEnvironment', () => {
    const paramsExpect: EnvironmentParams = {} as EnvironmentParams;

    const serviceParams = service.getEnvironment()

    expect(serviceParams).toEqual(paramsExpect);
  })

  // test('Debe traer el archivo params.json', (done) => {
  //   const paramsJsonExpect = environments.production
  //   service.getEnvParams().then(params => {
  //     expect(params).toBe(paramsExpect)

  //     done();
  //   })
  // })


});
