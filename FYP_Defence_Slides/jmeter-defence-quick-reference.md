# JMeter Defence Quick Reference

Use this document for preparation. Do not try to memorise every configuration value. Understand the test logic, the meaning of the metrics, and the boundaries of the conclusions.

## Eight Essential Terms

| Term | Plain-English meaning | 中文记忆 |
| --- | --- | --- |
| **Thread** | One simulated virtual user executing the steps in a test plan. It is a test parameter, not proof of an equal number of real supported users. | 一个模拟用户 |
| **Ramp-up** | The time JMeter takes to start all configured threads. A longer ramp-up introduces the load more gradually. | 多久启动完所有模拟用户 |
| **Loop** | The number of times each thread repeats the planned journey. | 每个模拟用户重复几次 |
| **Sampler** | One specific request executed by JMeter, such as an HTTP request to a product endpoint. | 一次具体请求 |
| **Average response time** | The mean time taken by all measured requests. It can hide slower tail requests. | 所有请求的平均时间 |
| **P90** | The response-time threshold within which 90% of requests completed; the slowest 10% took longer. | 90% 请求在这个时间内完成 |
| **Throughput** | The number of requests completed per unit of time, reported here per second. It depends on the scenario and test design. | 每秒完成多少请求 |
| **Error rate** | The percentage of samplers that JMeter classified as failed based on request results and assertions. | JMeter 判定失败的比例 |

## The Three-Sentence Test Story

1. I used JMeter because manual checking proves functionality for one user but does not provide repeatable performance metrics under controlled concurrency.
2. I tested eight real workflows through the same public HTTP and Nginx path used by the browser.
3. The retained workload completed 3,197 sampler executions with 0 observed JMeter errors, while multi-second P90 values identified optimisation priorities.

## Likely Panel Questions and Safe Answers

### 1. Why did you use Apache JMeter?

I needed a repeatable way to send controlled HTTP workload through the deployed public endpoint. JMeter allowed me to vary thread, ramp-up and loop parameters and collect response time, P90, throughput, sampler count and error rate. Manual testing could confirm that a function works, but it could not provide the same repeatable concurrent-access evidence.

### 2. What does one JMeter thread represent?

One thread represents one simulated virtual user executing the steps in a test plan. It is a workload parameter. I do not interpret 200 threads as proof that the application can continuously support 200 independent real users in production.

### 3. Why did you use different thread levels?

The scenarios have different risks and behaviours. Read-only requests do not change business data, so they were tested up to 200 threads. Login and order-history requests require authentication and were tested up to 100 threads. Cart, order and payment requests change live data, so they were deliberately limited to 10 threads to preserve controlled and repeatable demonstration data.

### 4. Why were mutation tests limited to 10 threads? Does this mean the system only supports 10 users?

No. The value was a safety boundary for the experiment, not a discovered system limit. Mutation tests create carts, orders, stock changes and payment-state changes. A lower controlled level reduced data drift and made the database impact easier to verify. The project did not perform stress testing to find the maximum number of supported users.

### 5. What is the difference between a thread and a sampler execution?

A thread is a simulated user. A sampler execution is one individual request generated while the thread follows the test plan. One thread can execute several samplers and can repeat them through loops. Therefore, the 3,197 sampler executions must not be interpreted as a user count.

### 6. What does P90 mean?

P90 is a percentile. If the P90 response time is 3,659 ms, 90% of the measured requests completed within 3,659 ms, while the slowest 10% took longer. I use P90 because an average can hide slower user-visible requests.

### 7. Why do you report both average response time and P90?

Average response time summarises the overall central tendency. P90 shows the slower tail that many users may still experience. Together, they give a more useful picture than the average alone.

### 8. What does 0 observed JMeter errors actually prove?

It proves that JMeter did not classify any sampler as failed in the retained workload under the defined test settings and assertions. It does not prove that the system has no software defects, that every possible request will succeed, or that the deployment is production-ready.

### 9. Why are some P90 values above three seconds?

The heavier product and login scenarios include public-network latency, Nginx routing, backend processing and database or Redis interaction on a single VM. Product detail recorded 3,659 ms, product list 3,400 ms and login 3,116 ms at their highest tested concurrency. These values indicate optimisation opportunities in queries, indexing, caching, application configuration and frontend delivery.

### 10. Why was Product Detail slower than Homepage?

Product detail can require more application and database work, including retrieving a selected product and its related variant data. The exact result also includes the public network route and the conditions of that test run. My conclusion is limited to the observed workload; further profiling would be required to attribute the delay to one exact component.

### 11. Why can throughput not be compared directly across every scenario?

The scenarios used different thread counts, sampler sequences, loops and data-changing behaviour. A homepage test and a simulated-payment journey do not represent the same amount or type of work. I therefore interpret throughput within each scenario and test design, rather than ranking every scenario as if they were identical requests.

### 12. How do you know the requests were successful?

The test plans used JMeter request results and assertions, and the retained JTL summaries recorded the observed error count and error rate. Smoke tests were executed before heavier workload. Functional, build, database and deployment checks also established readiness before performance testing.

### 13. Why did you test through the public endpoint rather than directly against Spring Boot?

The project evaluates the deployed request path used by real visitors. Testing the public endpoint includes HTTP access to the cloud VM, Nginx reverse-proxy routing, backend processing and data-service interaction. Direct backend testing would exclude important parts of the Network Technology path.

### 14. Did you test HTTPS?

No. The completed deployment used HTTP on port 80. No TLS certificate, port 443 listener or HTTP-versus-HTTPS comparison was implemented. HTTPS deployment and a controlled comparison are future work.

### 15. Did you test until the system failed?

No. This was a controlled performance evaluation at selected academic workload levels, not a stress test to failure. Therefore, I can report behaviour under the tested parameters, but I cannot claim the maximum capacity of the system.

### 16. Why did the load generator run from your local computer?

The local workstation generated traffic to the public cloud endpoint, which was practical within the FYP environment. The limitation is that measured response time can include internet-route variability between the workstation and the cloud VM. It is not purely server processing time.

### 17. What would you improve first based on the results?

I would first add HTTPS for secure public access. For performance, I would profile the product and login paths, review database indexes and SQL queries, evaluate Redis caching, and tune JVM and Nginx settings. I would then repeat the same controlled scenarios so the results can be compared fairly with the current baseline.

## Numbers Worth Memorising

- **8 scenarios**: homepage, product list, product detail, login, add to cart, place order, simulated payment and order history.
- **35 retained result rows**.
- **3,197 sampler executions**.
- **0 observed JMeter errors** and **0.00% overall observed error rate**.
- Highest tested concurrency: **200 read-only threads**, **100 authenticated threads**, **10 controlled-mutation threads**.
- Highest P90 values: **Product Detail 3,659 ms**, **Product List 3,400 ms**, **Login 3,116 ms**, **Homepage 2,457 ms**.

## If You Forget a Detail During Questions

Use this safe response:

> “I do not want to give an inaccurate configuration value from memory. The retained report records the exact parameter. What I can explain is the test logic: the scenario was executed through the public HTTP path with controlled thread, ramp-up and loop settings, and I interpreted response time, P90, throughput and observed error rate within that defined workload.”
