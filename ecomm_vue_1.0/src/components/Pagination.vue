<template>
  <!-- 分頁 Pagination -->
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{'disabled':!pageData.has_pre}">
        <a class="page-link" href="#" aria-label="Previous" @click="changePage(pageData.current_page - 1)">  
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" v-for="page in pageData.total_pages" :key="page"
      :class="{'active':pageData.current_page === page}">
        <a class="page-link" href="#" @click.prevent="changePage(page)">
          {{page}}
        </a>
      </li>
      <li class="page-item" :class="{'disabled':!pageData.has_next}">
        <a class="page-link" href="#" aria-label="Next" @click="changePage(pageData.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    pageData: {
    }
  },
  methods: {
    changePage(page){
      console.log(page);
      this.$emit("changeFatherPage", page);
    }
},
created() {
  this.changePage();
},
}
</script>
