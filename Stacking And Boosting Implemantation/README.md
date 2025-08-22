# Stacking and Boosting (AdaBoost) Implementation

This project demonstrates the implementation of **ensemble learning techniques** — **Stacking** and **Boosting (AdaBoost)** — for classification tasks using Python and Scikit-Learn.

---

## 📌 Overview

Ensemble learning combines multiple models to improve predictive performance compared to individual models.  
In this project, we focus on two major ensemble methods:

- **Stacking**: Combines multiple base classifiers using a meta-classifier.
- **Boosting (AdaBoost)**: Builds a strong classifier by combining weak learners iteratively, where each new learner focuses on the errors of the previous ones.

---

## ⚙️ Requirements

The implementation uses Python with the following libraries:

- `matplotlib`
- `seaborn`
- `scikit-learn`

---

## 📊 Dataset

The experiments were performed on a dataset (Breast Cancer loaded via `sklearn.datasets`).  
The dataset was split into **training** and **testing sets** for model evaluation.

---

## 🔹 Stacking Classifier

### What is Stacking?

Stacking is an ensemble method where **multiple base models** (level-0 models) are trained, and their predictions are combined using a **meta-model** (level-1 model).

- Base learners capture different aspects of the data.
- The meta-learner learns how to best combine their outputs.

### Implementation

```python
from sklearn.ensemble import StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC

# Define base learners
base_learners = [
    ('dt', DecisionTreeClassifier(random_state=44)),
    ('lr', LogisticRegression(random_state=44)),
    ('knn', KNeighborsClassifier())
]

# Define meta learner
meta_learner=DecisionTreeClassifier(random_state=44)
# Stacking Classifier
stacking_clf = StackingClassifier(
    estimators=base_learners,
    final_estimator=meta_learner,
    # cv=5 could be used but we skipped as this is just basic implementation.
)

stacking_clf.fit(X_train, y_train)
y_pred = stacking_clf.predict(X_test)

# model evaluation
accuracy_score(y_test,y_pred) #0.9440559440559441

```
## 📊 Results

- The **stacking classifier** achieved accuracy = `94%` .
- The **meta-learner (Decision Tree)** effectively combined the strengths of the base models.  



## 🔹 Boosting (AdaBoost)

### What is AdaBoost?

**AdaBoost (Adaptive Boosting)** is an ensemble technique that combines multiple weak classifiers (commonly decision stumps).  
Each new classifier corrects the errors of the previous ones by **updating weights** on misclassified samples.

---

### Implementation

```python
# import adaboost classifier
from sklearn.ensemble import AdaBoostClassifier
# define the model
ada_model=AdaBoostClassifier(random_state=44)
# fit the model on the training data
ada_model.fit(X_train,y_train)
# make predictions from the trained model
y_pred_adaboost=ada_model.predict(X_test)

y_pred_adaboost

# model evaluation
accuracy_score(y_test,y_pred_adaboost) #0.986013986013986
```

## 📊 Results

- **AdaBoost** significantly improved classification performance with accuracy = `98%`.  
- By sequentially focusing on harder-to-classify instances, the model achieved **higher accuracy and robustness**.  

---

## ✅ Key Takeaways

- **Stacking** leverages the strengths of multiple different models via a meta-learner.  
- **AdaBoost** builds a strong classifier by iteratively correcting mistakes of weak learners.  
- **Ensemble methods** generally outperform individual models on complex datasets.  

---

## 🚀 Future Work

- Perform **hyperparameter tuning** for further performance gains.  
- Test on **larger and more complex datasets**.  

---
