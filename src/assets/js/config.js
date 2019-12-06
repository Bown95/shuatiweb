var api = api || {};
//  环境地址

api.monmsg = "网络异常，请重试";

// 3.4 根据条件查询错题
api.question_list_errquestion = "question/list_errquestion";
// 3.5 刷题单题提交
api.question_submit_question = "question/submit_question";
// 3.6 提交试卷
api.question_hand_paper = "question/hand_paper";
// 3.7 错题最近一次用户做题选项
api.question_list_errquestion_option = "question/list_errquestion_option";
// 4.3 获取单个用户
api.user_get_user = "user/get_user";
// 4.5 修改用户
api.user_update_user = "user/update_user";
// 4.7 用户登录
api.user_login_user = "user/login_user";
// 5.3 学段展示
api.level_list_level = "level/list_level";
// 5.02 科目展示
api.subject_list_subject = "subject/list_subject";
// 5.5 教材展示   年级/分册
api.book_list_book = "book/list_book";
// 6.3 章节列表信息
api.director_list_director = "director/list_director";
// 8.1 指定条件生成试卷
api.paper_generate_paper = "paper/generate_paper";
// 8.11 保存试卷、开始刷题
api.paper_save_paper = "paper/save_paper";
// 8.2 获取用户历史试卷
api.paper_list_userPaperHistory = "paper/list_userPaperHistory";
// 8.3 查看试卷信息详情
api.paper_get_paper = "paper/get_paper";
// 9.2 获取用户初始化默认试卷生成参数
api.userDetail_get_userDetaill = "userDetail/get_userDetaill";
// 10.1 用户中心获取我的错题
api.question_list_errorquestion = "question/list_errorquestion";
// 10.2 客户端学生修改密码功能
api.user_update_userpwd = "user/update_userpwd";
export { api };
