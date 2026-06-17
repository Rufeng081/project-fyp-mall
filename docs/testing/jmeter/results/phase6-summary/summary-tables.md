# Phase 6 JMeter Summary Tables

Generated from local JMeter `.jtl` files. Raw `.jtl` and generated HTML reports are intentionally ignored by Git; this file and the CSV summary are the retained evidence.

| Category | Scenario | Threads | Samples | Errors | Error Rate | Avg ms | Median ms | P90 ms | Max ms | Throughput/s |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| authenticated load | `04_login` | 10 | 10 | 0 | 0.00% | 2238.10 | 2265 | 2784 | 3147 | 0.89 |
| authenticated load | `04_login` | 50 | 50 | 0 | 0.00% | 1085.98 | 859 | 2012 | 2125 | 2.31 |
| authenticated load | `04_login` | 100 | 100 | 0 | 0.00% | 2067.24 | 2128 | 3116 | 3643 | 2.32 |
| authenticated load | `08_order_history` | 10 | 20 | 0 | 0.00% | 2009.30 | 1915 | 2468 | 2569 | 1.65 |
| authenticated load | `08_order_history` | 50 | 100 | 0 | 0.00% | 1074.81 | 849 | 1971 | 3036 | 4.27 |
| authenticated load | `08_order_history` | 100 | 200 | 0 | 0.00% | 1170.88 | 973 | 1986 | 2644 | 4.61 |
| controlled mutation | `05_add_to_cart` | 1 | 2 | 0 | 0.00% | 611.50 | 441 | 782 | 782 | 1.61 |
| controlled mutation | `05_add_to_cart` | 5 | 10 | 0 | 0.00% | 1045.70 | 901 | 1192 | 1869 | 1.80 |
| controlled mutation | `05_add_to_cart` | 10 | 20 | 0 | 0.00% | 949.70 | 730 | 2035 | 2218 | 1.51 |
| controlled mutation | `06_place_order` | 1 | 4 | 0 | 0.00% | 1835.25 | 1794 | 2391 | 2391 | 0.54 |
| controlled mutation | `06_place_order` | 5 | 20 | 0 | 0.00% | 737.90 | 605 | 1071 | 1388 | 3.15 |
| controlled mutation | `06_place_order` | 10 | 40 | 0 | 0.00% | 1320.25 | 1269 | 1882 | 2483 | 3.00 |
| controlled mutation | `07_simulated_payment` | 1 | 5 | 0 | 0.00% | 209.00 | 175 | 346 | 346 | 4.68 |
| controlled mutation | `07_simulated_payment` | 5 | 25 | 0 | 0.00% | 256.64 | 256 | 415 | 530 | 4.48 |
| controlled mutation | `07_simulated_payment` | 10 | 50 | 0 | 0.00% | 254.82 | 213 | 441 | 756 | 4.79 |
| read-only load | `01_homepage` | 10 | 40 | 0 | 0.00% | 1071.90 | 1009 | 1607 | 1924 | 2.62 |
| read-only load | `01_homepage` | 50 | 200 | 0 | 0.00% | 2273.58 | 1666 | 5428 | 10588 | 7.22 |
| read-only load | `01_homepage` | 100 | 400 | 0 | 0.00% | 3283.55 | 3160 | 5478 | 13342 | 8.53 |
| read-only load | `01_homepage` | 200 | 800 | 0 | 0.00% | 1491.54 | 954 | 2457 | 12307 | 12.32 |
| read-only load | `02_product_list` | 10 | 10 | 0 | 0.00% | 1184.30 | 1084 | 1663 | 2036 | 1.01 |
| read-only load | `02_product_list` | 50 | 50 | 0 | 0.00% | 733.78 | 734 | 968 | 1069 | 2.47 |
| read-only load | `02_product_list` | 100 | 100 | 0 | 0.00% | 1954.46 | 1535 | 3473 | 5075 | 2.47 |
| read-only load | `02_product_list` | 200 | 200 | 0 | 0.00% | 1936.82 | 1922 | 3400 | 4340 | 3.28 |
| read-only load | `03_product_detail` | 10 | 20 | 0 | 0.00% | 1498.30 | 1516 | 1751 | 1893 | 1.70 |
| read-only load | `03_product_detail` | 50 | 100 | 0 | 0.00% | 1947.56 | 1951 | 2537 | 3210 | 4.56 |
| read-only load | `03_product_detail` | 100 | 200 | 0 | 0.00% | 1729.99 | 1160 | 3634 | 4163 | 4.37 |
| read-only load | `03_product_detail` | 200 | 400 | 0 | 0.00% | 2302.22 | 1849 | 3659 | 7642 | 6.09 |
| smoke | `01_homepage` | 1 | 4 | 0 | 0.00% | 731.75 | 721 | 791 | 791 | 1.36 |
| smoke | `02_product_list` | 1 | 1 | 0 | 0.00% | 746.00 | 746 | 746 | 746 | 1.34 |
| smoke | `03_product_detail` | 1 | 2 | 0 | 0.00% | 725.50 | 631 | 820 | 820 | 1.38 |
| smoke | `04_login` | 1 | 1 | 0 | 0.00% | 994.00 | 994 | 994 | 994 | 1.01 |
| smoke | `05_add_to_cart` | 1 | 2 | 0 | 0.00% | 1002.50 | 597 | 1408 | 1408 | 0.99 |
| smoke | `06_place_order` | 1 | 4 | 0 | 0.00% | 1300.25 | 1192 | 1705 | 1705 | 0.77 |
| smoke | `07_simulated_payment` | 1 | 5 | 0 | 0.00% | 2169.60 | 2243 | 2922 | 2922 | 0.46 |
| smoke | `08_order_history` | 1 | 2 | 0 | 0.00% | 1797.00 | 1617 | 1977 | 1977 | 0.55 |
