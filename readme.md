
### 开发注意：
1. 开发功能分支以feature/* 开头，从master上拉取
2. feature分支合到develop分支，需要PR/CodeReview
3. 上线/阶段成果分支release/v*，上完合入master
4. 组件中不要存在action、API请求，尽量作为UI组件
5. 每个组件，控制shouldComponentUpdate生命周期
