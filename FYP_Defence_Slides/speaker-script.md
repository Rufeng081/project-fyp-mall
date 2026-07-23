# FYP Defence Verbatim Script

Target duration: approximately 10 minutes, including a three-minute live demonstration.

## Slide 1 — Building, Deploying and Evaluating R Mall

**Target: 15 seconds**

Good morning, members of the panel. I am Li Rufeng, matric number A206331. My project is titled “Development and Network Performance Evaluation of a Cloud-Based Small E-Commerce Platform.” The system is called R Mall. This presentation explains how I developed R Mall into a deployed and measurable cloud system.

## Slide 2 — A Working Website Is Not Yet a Network Technology Project

**Target: 25 seconds**

The project began with a simple problem. Many student web applications stop when their functions work on localhost. However, functional correctness alone does not explain how public requests travel through a deployed network path, or how the system behaves when multiple simulated users access it. Therefore, my project had to be deployable, its communication path had to be explainable, and its behaviour had to be measurable.

## Slide 3 — Three Objectives, One Iterative Method

**Target: 25 seconds**

I defined three objectives. First, to build a complete but bounded cloud e-commerce platform. Second, to implement and analyse the communication path between the browser, reverse proxy, backend and data services. Third, to evaluate network performance under different test parameters. I used iterative incremental development, covering localisation, authentication, cloud deployment, runtime stabilisation and performance evaluation.

## Slide 4 — Each Increment Made the Next Stage Testable

**Target: 40 seconds**

The development sequence was important. I first stabilised the customer flow and converted the visible interface to English with Malaysian Ringgit pricing. I then strengthened authentication using email verification and Redis-based temporary state. After the local functions were stable, I deployed the application and its supporting services to a Google Cloud virtual machine. The next increment corrected production routing, media and history-mode issues. Only after the deployed path was working consistently did I prepare and execute the performance evaluation. In each increment, I implemented, verified, corrected and then extended the system.

## Slide 5 — Real Shopping Journeys Became Realistic Network Workloads

**Target: 40 seconds**

The final application supports one complete customer journey: registration or login, product browsing, cart management, order placement, simulated payment and order history. It also includes basic administrator management for users, products, categories, variants and orders. These functions are not only product features. Together, they create realistic network workloads containing public reads, authenticated requests, database queries, data changes and session state. This makes the platform useful for both demonstration and controlled performance evaluation.

## Slide 6 — Every Public Request Travelled Through One Documented Cloud Path

**Target: 50 seconds**

This diagram shows the deployed communication path. A browser, or JMeter during testing, sends an HTTP request to the public address of the Google Cloud VM. Nginx is the public entry point on port 80. It serves the Vue single-page application and forwards API requests through the slash-api route to the internal Spring Boot service. Spring Boot applies the business logic and communicates with MySQL for persistent business records and Redis for temporary verification, cooldown and session state. Selected registration and password-reset flows also use Brevo SMTP for email delivery. Therefore, the measured path includes public HTTP access, reverse-proxy routing, backend processing and data-service communication.

## Slide 7 — Three Integration Problems Defined the Deployed System

**Target: 45 seconds**

Three integration problems shaped the final implementation. First, development URLs and browser history routes did not automatically work in production, so Nginx became the single public entry point with explicit API proxying and SPA fallback. Second, email codes and login sessions required short-lived state, so Redis was used for verification codes, a five-minute expiry, resend cooldown and session records. Third, uploaded media could disappear or resolve through the wrong path, so I separated persistent uploads from application builds and added explicit resource routing. These decisions produced one consistent request path, repeatable account access and stable public images.

## Slide 8 — Live Demonstration

**Target: approximately 3 minutes**

[Switch from the slides to the deployed R Mall system.]

I will now demonstrate the main implemented workflow. This is the customer storefront served through the public cloud entry point.

[Open the homepage, then move to Category or use Search.]

The homepage and catalogue allow users to browse, search and filter the available products. These actions represent public read requests. I will open one product to show its details, price and available variant.

[Open a product. Move to Login.]

Account access is required for the cart and order functions. The system also supports email-code registration and forgotten-password reset. The verification code is stored temporarily in Redis with an expiry and resend cooldown. To keep this demonstration short, I will use the prepared account.

[Log in. Add one item to the cart.]

After login, the authenticated request includes the user session. I can add the selected variant to the cart and review the quantity and subtotal.

[Open the cart, continue to the order confirmation and place the order.]

When I place the order, the backend validates the request and writes the order data to MySQL. The system then moves to the simulated payment stage.

[Complete simulated payment, then open My Orders.]

The payment is deliberately simulated because real financial settlement is outside this project scope. However, the workflow still changes the order state and related business data. The completed order then appears in the order history.

[Open the administrator interface.]

Finally, the administrator interface provides basic management for products, categories, users and orders. This completes the demonstrated customer-to-administrator system scope.

[Return to Slide 9.]

### Live demonstration fallback

If the public deployment is temporarily unavailable, say: “The live endpoint is currently not responding, so I will continue with the planned workflow sequence shown on this slide. The retained evidence confirms the implemented functions: public browsing, authenticated cart access, order placement, simulated payment, order history and administrator management. I will now move to the controlled performance evaluation of that deployed request path.”

## Slide 9 — Eight Scenarios, Three Controlled Workload Types

**Target: 55 seconds**

After verifying the functions, I used Apache JMeter to generate repeatable HTTP requests through the same public endpoint. Eight scenarios were divided into three workload types. Read-only scenarios covered the homepage, product list and product detail, with the highest test level at 200 threads. Authenticated scenarios covered login and order history, with up to 100 threads. Controlled mutation scenarios covered add to cart, place order and simulated payment, with up to 10 threads. The mutation level was intentionally lower because these requests change live stock, cart and order data. These values are test parameters, not a statement about the number of real users the platform can support.

## Slide 10 — Main Test Results

**Target: 65 seconds**

The retained Phase 6 summary contains 35 result rows and 3,197 sampler executions. Across those retained results, JMeter recorded 0 observed JMeter errors, giving an overall observed error rate of 0.00%. This means the selected requests completed successfully under the defined workload; it does not prove production readiness.

The P90 result means that 90 percent of requests completed within the displayed time. At the highest tested concurrency, product detail recorded 3,659 ms, product list 3,400 ms, login 3,116 ms and homepage 2,457 ms. The controlled mutation scenarios used lower thread levels and should not be compared directly as capacity results. My interpretation is therefore balanced: the tested request path remained stable, but multi-second P90 values show that product retrieval, login and related database work should be prioritised for optimisation.

## Slide 11 — Objectives Achieved within Clear Boundaries

**Target: 30 seconds**

The results support all three objectives. I built and deployed the required customer and administrator workflows. I documented and analysed the public HTTP, reverse-proxy and internal service path. I also evaluated eight scenarios using response time, P90, throughput and error rate. The conclusion remains within four boundaries: one cloud VM, HTTP only, simulated payment and a controlled academic workload. Therefore, the evidence supports a working academic prototype, not a production service claim.

## Slide 12 — R Mall as a Measurable Network Testbed

**Target: 30 seconds**

In conclusion, the contribution of R Mall is the connection between application development and Network Technology analysis. It provides a working e-commerce application, a documented cloud request path and measurable evidence of how that path behaved. Future work can add HTTPS, optimise database queries and caching, and expand the workload model. The project therefore achieved its purpose: turning a familiar e-commerce workflow into a practical and measurable cloud network testbed. Thank you. I welcome your questions.
