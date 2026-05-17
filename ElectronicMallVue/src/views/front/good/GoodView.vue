<template>
    <div class="main-box">
        <div>
            <!--    Left image-->
            <!-- <div class="image-box">
        <img :src="baseApi + good.imgs" class="image" />
      </div> -->

            <div class="image-container">
                <img :src="baseApi + good.imgs" alt="Your Image" />
            </div>
            <!--    Right detail panel-->
            <div class="detail-box">
                <!--      Product name and description-->
                <div>
                    <span style="font-size: 22px"
                        ><strong>{{ good.name }}</strong></span
                    ><br />
                </div>
                <div style="margin-top: 20px">
                    <span style="font-size: 17px">{{ good.description }}</span>
                </div>
                <!--      Price panel-->

                <div class="price-box" v-if="good.discount < 1">
                    <dl>
                        <div>
                            <dt>Original Price</dt>
                            <dd style="text-decoration: line-through">
                                RM <b>{{ price }}</b>
                            </dd>
                        </div>
                        <div>
                            <dt>Discount</dt>
                            <dd>{{ discount }}</dd>
                        </div>
                        <div>
                            <dt>Sale Price</dt>
                            <dd style="color: red; font-size: 25px">
                                RM <b>{{ realPrice }}</b>
                            </dd>
                        </div>
                    </dl>
                </div>
                <div class="price-box" v-if="good.discount === 1">
                    <dl>
                        <div>
                            <dt>Price</dt>
                            <dd style="color: red; font-size: 25px">
                                RM  <b>{{ price }}</b>
                            </dd>
                        </div>
                    </dl>
                </div>
                <!--      Monthly Sales-->
                <div style="margin-top: 20px">
                    <span>Monthly Sales:</span>
                    <span>{{ good.sales }}</span
                    ><br />
                    <span style="height: 40px" v-if="showStore"
                        >Stock: {{ store }}</span
                    >
                </div>
                <!--      Select variant-->
                <div
                    style="margin-top: 15px; height: 50px"
                    v-if="standards.length !== 0"
                >
                    <el-radio-group
                        v-for="(standard, index) in standards"
                        v-model="checkedStandard"
                        @change="change(standard)"
                        :key="index"
                    >
                        <el-radio-button
                            class="standard"
                            :label="standard.value"
                        ></el-radio-button>
                    </el-radio-group>
                </div>
                <!--      Select quantity-->
                <div style="margin-top: 20px">
                    <el-input-number
                        v-model="count"
                        controls-position="right"
                        :min="1"
                        :max="store"
                    ></el-input-number>
                </div>
                <!--      Purchase buttons-->
                <div style="margin-top: 30px">
                    <el-button type="success" @click="goToOrder"
                        >Buy Now</el-button
                    >
                    <el-button
                        type="primary"
                        @click="addToCart"
                        icon="el-icon-shopping-cart-1"
                        >Add to Cart</el-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import API from "@/utils/request";

export default {
    name: "GoodView",
    data() {
        return {
            baseApi: this.$store.state.baseApi,
            good: {},
            goodId: Number,
            price: -1,
            isDiscount: false,
            discount: "",
            standards: [],
            checkedStandard: "",
            store: 0,
            showStore: false,
            count: 1,
        };
    },
    methods: {
        getPriceRange(standards) {
            let arr = standards.map((item) => {
                return item.price;
            });
            //Selection sort
            for (let i = 0; i < arr.length; i++) {
                // Assume the current item is the minimum and scan the rest
                let min = i;
                for (let j = i + 1; j < arr.length; j++) {
                    // Compare with later values and keep the minimum index
                    if (arr[j] < arr[min]) {
                        min = j;
                    }
                }
                [arr[i], arr[min]] = [arr[min], arr[i]];
            }
            if (arr[0] === arr[arr.length - 1]) {
                return arr[0];
            } else {
                return arr[0] + " ~ " + arr[arr.length - 1];
            }
        },
        change(standard) {
            this.showStore = true;
            this.price = standard.price;
            this.store = standard.store;
        },
        goToOrder() {
            if (this.standards.length !== 0) {
                if (this.checkedStandard === "") {
                    this.$message.warning("Please select a variant");
                    return false;
                }
            }
            console.log(this.good);
            console.log(this.checkedStandard);
            this.$router.push({
                name: "preOrder",
                query: {
                    good: JSON.stringify(this.good),
                    realPrice: this.realPrice,
                    num: this.count,
                    standard: this.checkedStandard,
                },
            });
        },
        addToCart() {
            //Redirect guests to login
            console.log(localStorage.getItem("user"));
            if (!localStorage.getItem("user")) {
                this.$router.push("/login");
                return false;
            }
            if (!this.checkedStandard) {
                this.$message.error("Please select a variant");
                return false;
            }
            // Get current user ID from the server
            this.request.get("/userid").then((res) => {
                let userId = res;
                let cart = {
                    userId: userId,
                    goodId: this.goodId,
                    standard: this.checkedStandard,
                    count: this.count,
                };
                this.request.post("/api/cart", cart).then((res) => {
                    if (res.code === "200") {
                        this.$message.success("Added to cart successfully");
                    }
                });
            });
        },
    },

    created() {
        //Initialize product information
        // this.good = JSON.parse(this.$route.query.good)
        this.goodId = this.$route.params.goodId;
        this.request.get("/api/good/" + this.goodId).then((res) => {
            if (res.code === "200") {
                this.good = res.data;
                let discount = this.good.discount;
                if (discount < 1) {
                    this.isDiscount = true;
                    this.discount = (discount * 100).toFixed(0) + "% of original price";
                }
            } else {
                this.$router.go(0);
            }
        });
        //Get product variant information from the server
        this.request.get("/api/good/standard/" + this.goodId).then((res) => {
            if (res.code === "200") {
                let standards = JSON.parse(res.data);
                this.standards = standards;
                //Select the first variant by default
                this.price = this.getPriceRange(standards);
            } else {
                //No variants
                this.price = this.good.price;
                this.store = this.good.store;
                this.showStore = true;
            }
        });
    },
    mounted() {},
    computed: {
        // Discounted price with two decimal places.
        realPrice: function () {
            if (this.good.discount < 1) {
                //When price is a range, calculate both bounds
                if (isNaN(this.price)) {
                    let prices = this.price.split(" ~ ");
                    let down = Number(prices[0]) * this.good.discount;
                    let up = Number(prices[1]) * this.good.discount;
                    return down.toFixed(2) + " ~ " + up.toFixed(2);
                } else {
                    return (this.price * this.good.discount).toFixed(2);
                }
            }
            return this.price;
        },
    },
};
</script>

<style scoped>
.main-box {
    width: 1060px;
    margin: 20px auto;
    padding: 30px;
    background-color: #ffffff;
    overflow: hidden;
}

.image {
    height: 100%;
    width: 350px;
}
.image-container {
    width: 420px; /* Set fixed container width */
    height: 420px; /* Set fixed container height */
    overflow: hidden; /* Hide overflow */
    text-align: center;
    margin-left: 80px;
    margin-top: 30px;
    display: inline-block;
    overflow: hidden;
}

.image-container img {
    display: block; /* Display image as a block element */
    width: 100%; /* Image width fills the container */
    height: auto; /* Auto-adjust height by aspect ratio */
    object-fit: cover; /* Scale image to cover the container */
}

.detail-box {
    width: 420px;
    display: inline-block;
    margin-left: 50px;
    overflow: hidden;
}
.price-box {
    background-color: #e9e9e9;
    border-radius: 5px;
    font: 12px/1.5 "Microsoft Yahei", tahoma, arial;
    padding-bottom: 1px;
    padding-top: 1px;
    margin-right: 20px;
    margin-top: 30px;
}
.price-box div {
    line-height: 20px;
    margin-left: 8px;
    margin-bottom: 5px;
}
.price-box dl dt {
    float: left;
    font-size: 14px;
    line-height: 20px;
}
.price-box dl dd {
    font-size: 18px;
    line-height: 20px;
}
.button {
    width: 130px;
    height: 45px;
    background-color: #96e2e0;
    color: #710a0a;
}
.standard {
    height: 30px;
    margin-right: 10px;
}
</style>
