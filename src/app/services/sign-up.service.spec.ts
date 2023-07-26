import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SignUpService } from './sign-up.service';
import { ThumbnailResType } from '../interfaces/thumbnailResType';
import { UserType } from '../interfaces/user';

describe('SignUpService', () => {
  let service: SignUpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ SignUpService ]
    });

    service = TestBed.inject(SignUpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch thumbnail data', () => {
    const mockThumbnailData: ThumbnailResType = {
      albumId: 1,
      id: 3,
      title: "officia porro iure quia iusto qui ipsa ut modi",
      url: "https://via.placeholder.com/600/24f355",
      thumbnailUrl: "https://via.placeholder.com/150/24f355"
    };

    service.getThumbnailData(3).subscribe((thumbnail) => {
      expect(thumbnail).toEqual(mockThumbnailData);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/photos/3');
    expect(req.request.method).toEqual('GET');

    req.flush(mockThumbnailData);
  });

  it('should save the user data', () => {
    const mockUserData: UserType = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "Password123456",
      thumbnailUrl: "https://via.placeholder.com/150/24f355"
    };

    const mockUserRes = {
      user: mockUserData,
      id: 11,
    };

    service.saveUser(mockUserData).subscribe((user) => {
      expect(user).toEqual(mockUserRes);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toEqual('POST');

    req.flush(mockUserRes);
  });
});