import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RadarService, RadarData } from './radar.service';

describe('RadarService', () => {
  let service: RadarService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        RadarService,
      ],
    });

    service = TestBed.inject(RadarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getData', () => {
    it('should send GET to /radar', () => {
      const mockData: RadarData = {
        categories: [
          { id: 'c1', name: 'Languages', color: '#e74c3c' },
          { id: 'c2', name: 'Frameworks', color: '#3498db' },
        ],
        technologies: [
          { technologyId: 't1', name: 'TypeScript', category: 'Languages', categoryId: 'c1', score: 4, votes: 15 },
        ],
      };

      let result: RadarData | undefined;
      service.getData().subscribe((data) => {
        result = data;
      });

      const req = httpMock.expectOne('http://localhost:3000/api/radar');
      expect(req.request.method).toBe('GET');
      req.flush(mockData);

      expect(result).toEqual(mockData);
    });

    it('should append query params when period is provided', () => {
      const mockData: RadarData = { categories: [], technologies: [] };

      service.getData('2024-Q1').subscribe();

      const req = httpMock.expectOne('http://localhost:3000/api/radar?period=2024-Q1');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('period')).toBe('2024-Q1');
      req.flush(mockData);
    });

    it('should append query params when minScore is provided', () => {
      const mockData: RadarData = { categories: [], technologies: [] };

      service.getData(undefined, 3).subscribe();

      const req = httpMock.expectOne('http://localhost:3000/api/radar?minScore=3');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('minScore')).toBe('3');
      req.flush(mockData);
    });

    it('should append query params when both period and minScore are provided', () => {
      const mockData: RadarData = { categories: [], technologies: [] };

      service.getData('2024-Q1', 3).subscribe();

      const req = httpMock.expectOne('http://localhost:3000/api/radar?period=2024-Q1&minScore=3');
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('period')).toBe('2024-Q1');
      expect(req.request.params.get('minScore')).toBe('3');
      req.flush(mockData);
    });
  });
});
