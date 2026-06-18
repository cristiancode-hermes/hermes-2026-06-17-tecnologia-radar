import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, AuthResponse, User } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    routerSpy = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send POST to /auth/login and store token and currentUser', () => {
      const mockResponse: AuthResponse = {
        access_token: 'token-abc-123',
        user: { id: '1', name: 'Alice', email: 'alice@test.com', role: 'user' },
      };

      let result: AuthResponse | undefined;
      service.login('alice@test.com', 'secret').subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne('http://localhost:3000/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'alice@test.com', password: 'secret' });
      req.flush(mockResponse);

      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('token-abc-123');
      expect(service.currentUser()).toEqual(mockResponse.user);
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('register', () => {
    it('should send POST to /auth/register and store token and currentUser', () => {
      const mockResponse: AuthResponse = {
        access_token: 'token-xyz-789',
        user: { id: '2', name: 'Bob', email: 'bob@test.com', role: 'admin' },
      };

      let result: AuthResponse | undefined;
      service.register('Bob', 'bob@test.com', 'p@ss').subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne('http://localhost:3000/api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ name: 'Bob', email: 'bob@test.com', password: 'p@ss' });
      req.flush(mockResponse);

      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('token-xyz-789');
      expect(service.currentUser()).toEqual(mockResponse.user);
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear token, set currentUser to null, and navigate to /login', () => {
      localStorage.setItem('token', 'existing-token');
      service['currentUser'].set({ id: '1', name: 'Alice', email: 'alice@test.com', role: 'user' });

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getProfile', () => {
    it('should send GET to /auth/profile and update currentUser', () => {
      localStorage.setItem('token', 'test-token');
      const mockUser: User = { id: '3', name: 'Profile', email: 'profile@test.com', role: 'admin' };

      let result: User | undefined;
      service.getProfile().subscribe((user) => {
        result = user;
      });

      const req = httpMock.expectOne('http://localhost:3000/api/auth/profile');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush({ user: mockUser });

      expect(result).toEqual(mockUser);
      expect(service.currentUser()).toEqual(mockUser);
      expect(service.isAdmin()).toBe(true);
    });
  });
});
