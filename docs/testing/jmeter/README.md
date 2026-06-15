# JMeter Test Plans

Date: 2026-06-15

These JMeter plans support final FYP demonstration readiness testing for the small cloud-based mall system.

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
