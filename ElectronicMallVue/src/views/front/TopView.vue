<template>
    <div>
        <search @search="handleSearch"></search>

        <div class="main-box">
            <div class="block" style="margin: 10px auto">
                <!--      Category menu-->
                <div class="good-menu">
                    <ul v-for="(item, index) in icons" :key="index">
                        <li>
                            <i class="iconfont" v-html="item.value"></i>
                            <!--              Navigate to goodList with category ID-->
                            <span v-for="(category, index2) in item.categories" :key="index2">
                                <router-link
                                    :to="{
                                        path: '/goodList',
                                        query: { categoryId: category.id },
                                    }"
                                >{{ category.name }}</router-link>
                                <span
                                    v-if="index2 != item.categories.length - 1"
                                >
                                    /
                                </span>
                            </span>
                        </li>
                    </ul>
                </div>
                <!--Carousel-->
                <div>
                    <el-carousel
                        height="370px"
                        style="border-radius: 20px; width: 600px"
                    >
                        <el-carousel-item
                            v-for="carousel in carousels"
                            :key="carousel.id"
                        >
                            <router-link :to="'/goodView/' + carousel.goodId">
                                <img
                                    style="
                                        height: 370px;
                                        width: 600px;
                                        object-fit: contain;
                                        background-color: black;
                                    "
                                    :src="baseApi + carousel.img"
                                />
                            </router-link>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
            <!--Recommended Products-->
            <div style="margin-top: 30px">
                <i class="el-icon-a-02" style="color: #ff5e5e;font-size: 28px; font-weight: 600;">
                    Recommended Products
                </i>
            </div>

            <div style="margin: 20px auto">
                <el-row :gutter="20">
                    <el-col
                        :span="6"
                        v-for="good in good"
                        :key="good.id"
                        style="margin-bottom: 20px"
                    >
                        <router-link :to="'/goodView/' + good.id">
                            <el-card
                                :body-style="{
                                    padding: '0px',
                                    background: '#e3f5f4',
                                }"
                            >
                                <img
                                    :src="baseApi + good.imgs"
                                    style="width: 100%; height: 300px"
                                />
                                <div style="padding: 5px 10px">
                                    <span style="font-size: 18px"
                                        ><b>{{ good.name }}</b></span
                                    ><br />
                                    <span style="color: red; font-size: 15px"
                                        ><b>RM {{ good.price }}</b></span
                                    >
                                </div>
                            </el-card>
                        </router-link>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import search from "../../components/Search";
export default {
    name: "TopView",
    data() {
        return {
            //Carousel
            carousels: [],
            //Recommended Products
            good: [],
            baseApi: this.$store.state.baseApi,
            //Each category icon includes id, value, and category items
            icons: [],
            //Search text
            searchText: "",
        };
    },
    components: {
        search,
    },
    created() {
        this.request.get("/api/good").then((res) => {
            if (res.code === "200") {
                this.good = res.data;
            } else {
                this.$message.error(res.msg);
            }
        });
        this.request.get("/api/icon").then((res) => {
            if (res.code === "200") {
                this.icons = res.data;
                if (this.icons.length > 6) {
                    // Keep the first six categories
                    this.icons = this.icons.slice(0, 6);
                }
            }
        });
        this.request.get("/api/carousel").then((res) => {
            if (res.code === "200") {
                this.carousels = res.data;
            }
        });
    },
    methods: {
        handleSearch(text) {
            this.searchText = text;
            this.$router.push({
                path: "/goodList",
                query: { searchText: this.searchText },
            });
        },
    },
};
</script>

<style scoped>
.main-box {
    background-color: white;
    border: white 2px solid;
    border-radius: 40px;
    padding: 20px 40px;
    margin: 5px auto;
}
.good-menu {
    float: left;
    height: 370px;
    margin-right: 130px;
}
.good-menu li {
    list-style: none;
    overflow: hidden;
    margin-bottom: 35px;
}
.good-menu li a,
span {
    font-size: 20px;
    color: #6c6969;
}
.good-menu a span:hover {
    color: #00b7ff;
}
</style>
