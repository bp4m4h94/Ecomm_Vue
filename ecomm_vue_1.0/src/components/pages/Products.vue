<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="text-right mt-4">
            <button class="btn btn-primary" @click="openModal(true)">建立新產品</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                <th width="120">分類</th>
                <th>產品名稱</th>
                <th width="120">原價</th>
                <th width="120">售價</th>
                <th width="80">是否啟用</th>
                <th width="80">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,key) in products" :key="key">
                    <td>{{ item.category }}</td>
                    <td>{{ item.title }}</td>
                    <td class="text-right">
                        {{ item.origin_price | currency }}
                    </td>
                    <td class="text-right">
                        {{ item.price | currency }}
                    </td>
                    <td>
                        <span v-if="item.is_enabled" class="text-success">啟用</span>
                        <span v-else>未啟用</span>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">編輯</button>
                    </td>
                </tr>
            </tbody>
        </table>

<div class="modal fade" id="productModal" tabindex="-1" role="dialog"
  aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>新增產品</span>
        </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label for="image">輸入圖片網址</label>
              <input type="text" class="form-control" id="image" v-model="tempProduct.imageUrl"
                placeholder="請輸入圖片連結">
            </div>
            <div class="form-group">
              <label for="customFile">或 上傳圖片
                <i class="fas fa-spinner fa-spin" v-if="status.uploading"></i>
              </label>
              <input type="file" name="file-to-upload" id="customFile" class="form-control"
                ref="files" @change="uploadFile">
            </div>
            <img :src="tempProduct.imageUrl"
              class="img-fluid" alt="">
          </div>
          <div class="col-sm-8">
            <div class="form-group">
              <label for="title">標題</label>
              <input type="text" class="form-control" id="title"
                placeholder="請輸入標題" v-model="tempProduct.title">
            </div>

            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="category">分類</label>
                <input type="text" class="form-control" id="category"
                  placeholder="請輸入分類" v-model="tempProduct.category">
              </div>
              <div class="form-group col-md-6">
                <label for="price">單位</label>
                <input type="unit" class="form-control" id="unit"
                  placeholder="請輸入單位" v-model="tempProduct.unit">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-md-6">
              <label for="origin_price">原價</label>
                <input type="number" class="form-control" id="origin_price"
                  placeholder="請輸入原價" v-model="tempProduct.origin_price">
              </div>
              <div class="form-group col-md-6">
                <label for="price">售價</label>
                <input type="number" class="form-control" id="price"
                  placeholder="請輸入售價" v-model="tempProduct.price">
              </div>
            </div>
            <hr>

            <div class="form-group">
              <label for="description">產品描述</label>
              <textarea type="text" class="form-control" id="description"
                placeholder="請輸入產品描述" v-model="tempProduct.description"></textarea>
            </div>
            <div class="form-group">
              <label for="content">說明內容</label>
              <textarea type="text" class="form-control" id="content"
                placeholder="請輸入產品說明內容" v-model="tempProduct.content"></textarea>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input class="form-check-input" type="checkbox"
                  id="is_enabled" 
                  v-model="tempProduct.is_enabled" 
                  :true-value="1" :false-value="0">
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
  aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-danger text-white">
        <h5 class="modal-title" id="exampleModalLabel">
          <span>刪除產品</span>
        </h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
        <button type="button" class="btn btn-danger">
            確認刪除
        </button>
      </div>
    </div>
  </div>
</div>
<!-- 分頁 Pagination -->
<tag-page :page-data="pagination" @changeFatherPage="getProducts"></tag-page>
    </div>
</template>

<script>
import $ from 'jquery';
import Pagination from '../Pagination';

export default {
  components: {
   tagPage: Pagination
  },
  data() {
        return {
            products: [],
            tempProduct: {},
            isNew: false,
            isLoading: false,
            status: {
                uploading: false
            },
            pagination: {}
        }
    },
    methods: {
        getProducts(page = 1){//ES6參數預設值
            const vm = this;
            vm.isLoading = true;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products?page=${page}`
            this.$http.get(api).then((response) => {
                // console.log(response.data);
                vm.products = response.data.products;
                vm.isLoading = false;
                //分頁
                vm.pagination = response.data.pagination;
                console.log(response.data);
            })
        },
        openModal(isNew, item){
            const vm = this;
            //新增
            if(isNew){
              vm.tempProduct = {};
              vm.isNew = true;
            }//修改
            else{
                console.log(item);
              vm.tempProduct = Object.assign({}, item);
              vm.isNew = false;
            }
            
            $('#productModal').modal('show');
        },
        updateProduct(){
            const vm = this;
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`
            let httpMethod = 'post';
            //修改
            if(!vm.isNew){
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`
                httpMethod = 'put';
            }
            this.$http[httpMethod](api, {"data":vm.tempProduct}).then((response) => {
                //console.log(response.data);
                if(response.data.success){
                   $('#productModal').modal('hide');
                    this.getProducts();
                }else{
                    $('#productModal').modal('hide');
                    this.getProducts();
                    console.log('新增失敗');
                }
            });
        },
        uploadFile(){
            const uploadedFile = this.$refs.files.files[0];
            //console.log(uploadedFile);
            const vm = this;
            var formData = new FormData();
            formData.append('file-to-upload', uploadedFile);
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`
            this.$http.post(url, formData,{
                headers: {
                    'Content-Type' : 'multipart/form-data' 
                }
            }).then((response) => {
                console.log(response.data);
                if(response.data.success){
                    vm.status.uploading = true;
                    // vm.tempProduct.imageUrl = response.data.imageUrl 無效
                    //原因:https://cn.vuejs.org/v2/guide/reactivity.html  (響應式 v.s. 非響應式)
                    //雙向綁定
                    vm.$set(vm.tempProduct,'imageUrl',response.data.imageUrl);
                    vm.status.uploading = false;
                    // console.log(vm.tempProduct);
                }else{
                    vm.$bus.$emit('message:push', response.data.message, 'danger');
                }
            });
        },
    },
    created() {
        this.getProducts();
    },
}
</script>