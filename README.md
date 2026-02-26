# Monitoring (Prometheus + Grafana)

Event-Driven Board System의 성능 분석 및 확장성 검증을 위한 모니터링 구성입니다.

---

## 1. 목적

- 서비스별 메트릭 수집
- 부하 테스트 시 병목 지점 분석
- Auto Scaling 동작 검증
- Redis 적용 전/후 성능 비교

---

## 2. 구성 요소

### Prometheus
- Spring Boot Actuator `/actuator/prometheus` 메트릭 수집
- Micrometer 기반 메트릭 노출
- EC2 Service Discovery 기반 자동 타겟 탐색
- 5초 간격 수집

### Grafana
- Prometheus 데이터 시각화
- p95 Latency / RPS / CPU 사용량 대시보드 구성

---

## 3. 수집 대상 메트릭

### Application Level
- `http_server_requests_seconds`
- p95 latency
- request count
- error rate

### Infrastructure Level
- EC2 CPU 사용량
- RDS CPU
- Redis CPU / Cache Hit Ratio
- ASG scaling events

---

## 4. Service Discovery 방식

Prometheus는 EC2 Service Discovery를 사용합니다.

```yaml
ec2_sd_configs:
  - region: ap-northeast-2
    port: 8080
```

EC2 Tag(Name=board-service)을 기준으로 자동 탐색합니다.

이를 통해:

- ASG 확장 시 자동 메트릭 수집
- 수동 타겟 등록 불필요
- 운영 환경에 가까운 구조 구성

---

## 5. 부하 테스트 분석 흐름

1. k6로 트래픽 발생
2. Prometheus 메트릭 수집
3. Grafana 대시보드 확인
4. Redis OFF / ON 비교
5. 병목 이동 지점 분석

---

## 6. 주요 분석 결과

- Redis OFF → RDS CPU 급증
- Redis ON → 응답 시간 감소
- ASG 확장 시 latency 안정화
- 병목이 DB → App → Network 순으로 이동

---

## 7. Local 실행

```bash
docker-compose up -d
```

- Prometheus: 9090
- Grafana: 3000
