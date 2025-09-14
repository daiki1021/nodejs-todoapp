const taskIDDOM = document.querySelector(".task-edit-id");
const taskNameDOM = document.querySelector(".task-edit-name");
const taskCategoryDOM = document.querySelector(".task-edit-category");
const taskDueDateDOM = document.querySelector(".task-edit-due-date");
const editFormDOM = document.querySelector(".single-task-form");
const formAlertDOM = document.querySelector(".form-alert");
const taskCompletedDOM = document.querySelector(".task-edit-completed");


const params = window.location.search;
const id = new URLSearchParams(params).get("id");

console.log(id);

//1つの特定のタスクを取得する
const showTask = async() => {
    try {
        const {data:task} = await axios.get(`/api/v1/tasks/${id}`);
        const{ _id, completed, name, category, dueDate } = task;
        taskIDDOM.textContent = _id;
        taskNameDOM.value = name;
        taskCategoryDOM.value = category || 'その他';
        
        // 期限の設定（日付フォーマットを調整）
        if(dueDate) {
            const date = new Date(dueDate);
            const formattedDate = date.toISOString().split('T')[0];
            taskDueDateDOM.value = formattedDate;
        }
        
        if(completed){
            taskCompletedDOM.checked = true;
        }
    }catch(err){
        console.log(err);
    }
};

showTask();

//タスクの編集
editFormDOM.addEventListener("submit" , async (e) => {
    e.preventDefault();
    try{
        const taskName = taskNameDOM.value;
        const taskCategory = taskCategoryDOM.value;
        const taskDueDate = taskDueDateDOM.value || null;
        const taskCompleted = taskCompletedDOM.checked;
        
        const{data:task} = await axios.patch(`/api/v1/tasks/${id}`,{
            name: taskName,
            category: taskCategory,
            dueDate: taskDueDate,
            completed: taskCompleted,
        });
        formAlertDOM.style.display = "block";
        formAlertDOM.textContent = "編集に成功しました";
        formAlertDOM.classList.add("text-success");

    }catch(err){
        console.log(err);
        formAlertDOM.style.display = "block";
        formAlertDOM.textContent = "編集に失敗しました";
        formAlertDOM.classList.add("text-error");
    }
    setTimeout(() => {
        formAlertDOM.style.display = "none";
        formAlertDOM.classList.remove("text-success");
        formAlertDOM.classList.remove("text-error");
    }, 3000);
});
