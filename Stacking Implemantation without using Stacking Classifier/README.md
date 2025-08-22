
# Diabetes Prediction using Ensemble Learning

This project implements a **stacking ensemble model** to predict diabetes based on patient medical attributes. The dataset used is `diabetes.csv`.

The workflow involves:
* Data preprocessing and splitting
* Training base models (K-Nearest Neighbors and Support Vector Classifier)
* Combining predictions to form meta-features
* Training a Random Forest as meta-classifier
* Performing hyperparameter tuning using GridSearchCV

---

## 🔹 Code Implementation

### 1. Importing Libraries

```python
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
````

  - **Pandas, Numpy** → data handling
  - **Seaborn, Matplotlib** → visualization
  - **KNN, SVM** → base models

### 2\. Load Dataset

```python
data = pd.read_csv('.\\diabetes.csv')
data.head()
```

Loads the diabetes dataset for prediction.

### 3\. Feature & Target Separation

```python
X = data.drop('Outcome', axis=1)
y = data['Outcome']
print(X)
print(y)
```

  - **X** → independent features (medical measurements)
  - **y** → target label (diabetes outcome: 0 = No, 1 = Yes)

### 4\. Train-Test Splitting

```python
from sklearn.model_selection import train_test_split
train, val_train, test, val_test = train_test_split(X, y, test_size=0.5, random_state=44)

X_train, X_test, y_train, y_test = train_test_split(train, test, test_size=0.2, random_state=44)
```

  - Splits data into training, validation, and testing sets.
  - Ensures robust evaluation of models.

### 5\. Base Learners: KNN & SVM

```python
knn = KNeighborsClassifier()
knn.fit(X_train, y_train)

svc = SVC(probability=True)
svc.fit(X_train, y_train)
```

  - **KNN** → instance-based classifier
  - **SVM** → margin-based classifier

### 6\. Validation Predictions (Meta-Features)

```python
prediction_val1 = knn.predict(val_train)
prediction_val2 = svc.predict(val_train)

predict_val = np.column_stack((prediction_val1, prediction_val2))
predict_val.shape
```

Predictions from KNN and SVM are stacked as new features for meta-classifier training.

### 7\. Test Predictions

```python
predict_test1 = knn.predict(X_test)
predict_test2 = svc.predict(X_test)
predict_test = np.column_stack((predict_test1, predict_test2))
```

Similar stacking is applied to test data.

### 8\. Meta-Learner: Random Forest

```python
from sklearn.ensemble import RandomForestClassifier
rand_clf = RandomForestClassifier()
rand_clf.fit(predict_val, val_test)
rand_clf.score(predict_test, y_test)
```

  - Random Forest is trained on meta-features.
  - Evaluated on test stacked predictions.

### 9\. Hyperparameter Tuning with GridSearchCV

```python
grid_param = {
    "n_estimators": [100, 300, 500],
    "max_features": ["auto", "log2"],
    "criterion": ["gini", "entropy"],
    "min_samples_split": [4,5,6,7,8],
    "min_samples_leaf": [1,2,3,4,5]
}
from sklearn.model_selection import GridSearchCV
grid_search = GridSearchCV(estimator=rand_clf, param_grid=grid_param, cv=5, n_jobs=-1, verbose=3)

grid_search.fit(predict_val, val_test)
print(grid_search.best_params_)
```

  - Performs grid search to optimize Random Forest parameters.
  - Ensures best performing ensemble.

-----

## 📌 Summary

  - Built a **stacking ensemble** using KNN + SVM (base learners) and Random Forest (meta-learner)
  - Used **train-validation-test split** for robust performance evaluation
  - Applied **GridSearchCV** for hyperparameter tuning

This approach leverages the strength of multiple classifiers to improve prediction accuracy on the diabetes dataset.
