const tasksDOM = document.querySelector(".tasks");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const taskCategoryDOM = document.querySelector(".task-category");
const taskDueDateDOM = document.querySelector(".task-due-date");
const formAlertDOM = document.querySelector(".form-alert");

// フィルター要素
const categoryFilterDOM = document.querySelector(".category-filter");
const completedFilterDOM = document.querySelector(".completed-filter");
const filterBtnDOM = document.querySelector(".filter-btn");
const resetBtnDOM = document.querySelector(".reset-btn");

// /api/v1/tasksからタスクを読み込む（フィルター機能付き）
const showTasks = async (filters = {}) =>{
    try{
       // クエリパラメータを構築
       const queryParams = new URLSearchParams();
       if (filters.category) queryParams.append('category', filters.category);
       if (filters.completed) queryParams.append('completed', filters.completed);
       
       const queryString = queryParams.toString();
       const url = queryString ? `/api/v1/tasks?${queryString}` : '/api/v1/tasks';
       
       //自作のAPIを叩く
       const { data: tasks } = await axios.get(url);
       
//タスクが一つもないとき
       if(tasks.length < 1){
        tasksDOM.innerHTML = `<h5 class="empty-list">タスクがありません</h5> `;
        return;
       }
       //タスクを出力
       const allTasks = tasks.map((task) => {
        const{ completed, _id, name, category, dueDate}= task;
        
        // 期限の表示フォーマット
        const dueDateDisplay = dueDate ? 
            `<small class="due-date">期限: ${new Date(dueDate).toLocaleDateString('ja-JP')}</small>` : 
            '';
        
                return `<div class="single-task ${completed && "task-completed"}">
                <div class="task-info">
                    <h5>
                        <span><i class="fas fa-check-circle"></i></span>${name}
                    </h5>
                    <div class="task-details">
                        <small class="category">カテゴリー: ${category}</small>
                        ${dueDateDisplay}
                    </div>
                </div>
                <div class="task-links">
                  <!-- 編集リンク -->
                  <a href="edit.html?id=${_id}" class="edit-link">
                    <i class="fas fa-edit"></i>
                  </a>
                  <!--ゴミ箱リンク-->
                  <button type="button" class="delete-btn" data-id="${_id}">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
            </div>`;
            
       })
       .join("");
       tasksDOM.innerHTML = allTasks;
    }catch (err){
        console.log(err);
    }
};

showTasks();


//タスクを新規作成する
formDOM.addEventListener("submit", async (event) =>{
    event.preventDefault();
    const name = taskInputDOM.value;
    const category = taskCategoryDOM.value;
    const dueDate = taskDueDateDOM.value || null;
    
    try{
        await axios.post("/api/v1/tasks", {
            name: name,
            category: category,
            dueDate: dueDate
        });
        showTasks();
        taskInputDOM.value="";
        taskCategoryDOM.value="その他";
        taskDueDateDOM.value="";
        formAlertDOM.style.display = "block";
        formAlertDOM.textContent = "タスクを追加しました"
        formAlertDOM.classList.add("text-success");
    }catch(err){
        console.log(err);
        formAlertDOM.style.display = "block";
        formAlertDOM.innerHTML = "無効です。もう一度やり直してください。"
    }
    setTimeout(() => {
        formAlertDOM.style.display = "none";
        formAlertDOM.classList.remove("text-success");
    }, 3000);
});

//タスクを削除する
tasksDOM.addEventListener("click", async (event) =>{
    const element = event.target;
    console.log(element.parentElement );
    if(element.parentElement.classList.contains("delete-btn")){
        const id = element.parentElement.dataset.id;
        try{
          await axios.delete(`/api/v1/tasks/${id}`)
          showTasks();
        }catch(err){
            console.log(err);
        }
    }
})

// フィルター機能
const applyFilters = () => {
    const filters = {
        category: categoryFilterDOM.value !== 'all' ? categoryFilterDOM.value : null,
        completed: completedFilterDOM.value !== 'all' ? completedFilterDOM.value : null
    };
    
    showTasks(filters);
};

// フィルターボタンのイベントリスナー
filterBtnDOM.addEventListener("click", applyFilters);

// リセットボタンのイベントリスナー
resetBtnDOM.addEventListener("click", () => {
    categoryFilterDOM.value = 'all';
    completedFilterDOM.value = 'all';
    showTasks();
});
