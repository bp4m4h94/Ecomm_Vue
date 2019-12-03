<template>
  <!-- 分頁 Pagination -->
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{'disabled':!pagination.has_pre}">
        <a class="page-link" href="#" aria-label="Previous" @click="changePage(pagination.current_page - 1)">  
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" v-for="page in pagination.total_pages" :key="page"
      :class="{'active':pagination.current_page === page}">
        <a class="page-link" href="#" @click.prevent="changePage(page)">
          {{page}}
        </a>
      </li>
      <li class="page-item" :class="{'disabled':!pagination.has_next}">
        <a class="page-link" href="#" aria-label="Next" @click="changePage(pagination.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
   data() {
    return {
      pagination: this.$parent.pagination
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
