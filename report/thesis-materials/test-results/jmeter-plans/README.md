# JMeter Test Plans

Date: 2026-06-16

These JMeter plans support final FYP demonstration readiness testing for the small cloud-based mall system.

For Phase 6 planning, execution scope, load levels, result organization, and report interpretation, see:

- [phase-6-jmeter-performance-evaluation-plan.md](phase-6-jmeter-performance-evaluation-plan.md)
- [../../reports/phase-6-jmeter-performance-evaluation-report.md](../../reports/phase-6-jmeter-performance-evaluation-report.md)
- [results/phase6-summary/summary-tables.md](results/phase6-summary/summary-tables.md)

Default target:

| Variable | Default | Notes |
| --- | --- | --- |
| `BASE_PROTOCOL` | `http` | Cloud VM currently uses HTTP. |
| `BASE_HOST` | `34.143.225.11` | Current public VM endpoint. |
| `BASE_PORT` | `80` | Nginx public port. |
| `API_PREFIX` | `/api` | Cloud Nginx prefix. Use an empty value for direct local backend testing. |
| `USERNAME` | `user` | Demo customer account. |
| `PASSWORD_MD5` | `e10adc3949ba59abbe56e057f20f883e` | MD5 of `123456`, matching the current frontend flow. |

Plans:

| File | Flow |
| --- | --- |
| `01_homepage.jmx` | Frontend homepage plus homepage APIs. |
| `02_product_list.jmx` | Product list API with pagination. |
| `03_product_detail.jmx` | Product detail and product variant APIs. |
| `04_login.jmx` | Demo user login and token extraction. |
| `05_add_to_cart.jmx` | Login, then add one product variant to cart. |
| `06_place_order.jmx` | Login, add cart item, read latest cart item, then place order. |
| `07_simulated_payment.jmx` | Login, add cart item, place order, then call simulated payment. |
| `08_order_history.jmx` | Login, then read order history. |

Mutation warning:

- `05_add_to_cart.jmx`, `06_place_order.jmx`, and `07_simulated_payment.jmx` create or update demo data.
- Run them first against a local or disposable database.
- For the final cloud demo, keep threads and loops low unless the database has been backed up.

Suggested smoke command:

```bash
jmeter -n -t docs/testing/jmeter/04_login.jmx -l /tmp/fyp-mall-login.jtl
```

Suggested cloud readiness order:

1. `01_homepage.jmx`
2. `02_product_list.jmx`
3. `03_product_detail.jmx`
4. `04_login.jmx`
5. `08_order_history.jmx`
6. Mutation plans only after backup: `05_add_to_cart.jmx`, `06_place_order.jmx`, `07_simulated_payment.jmx`

Current planning status:

- Phase 6 was executed on 2026-06-16 as a controlled academic network performance evaluation, not a commercial capacity claim.
- Official retained results are under `results/phase6-summary/`.
- Raw `.jtl` files and generated HTML reports are stored locally under `results/` but ignored by Git.
- Mutation tests require a database backup and low concurrency because they create cart/order data and consume stock.
- Public backend `/api/*` routes should use `${API_PREFIX}/api/*` with `API_PREFIX=/api` under the current Nginx configuration.
