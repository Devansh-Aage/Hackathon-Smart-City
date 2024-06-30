# -*- coding: utf-8 -*-
"""Water_Quality.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1q94T0j0ZGkhqgBfqMKrDjRO0ukKGW2IS
"""

from google.colab import drive
drive.mount('/content/drive')

import pandas as pd
import numpy as np
import seaborn as sns

df=pd.read_csv("/content/drive/MyDrive/water_potability.csv")

df.head(5)

sns.boxplot(x='Sulfate', data=df)

sns.boxplot(x='ph', data=df)

sns.boxplot(x='Trihalomethanes', data=df)

df.isnull().sum()

df['ph'].value_counts()

df['ph'] = df['ph'].fillna(df['ph'].median())

df['Sulfate'] = df['Sulfate'].fillna(df['Sulfate'].median())

df['Trihalomethanes']=df['Trihalomethanes'].fillna(df['Trihalomethanes'].median())

df.head(10)

df=df.drop_duplicates()

df['Potability'].value_counts()

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report
from sklearn.utils import resample

df.info()

X=df.drop('Potability',axis=1)

y=df['Potability']

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report
import joblib

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import warnings

warnings.filterwarnings("ignore")

from termcolor import colored

from imblearn.over_sampling import SMOTE


import logging as log

from sklearn.preprocessing import RobustScaler, StandardScaler, MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X_log_transformed = np.log1p(X)

smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_log_transformed, y)

scaler = RobustScaler()
X_scaled = scaler.fit_transform(X_resampled)
joblib.dump(scaler, 'scalerwq.joblib')
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_resampled, test_size=0.2, random_state=42)
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', RandomForestClassifier(random_state=42))
])

param_grid = {
    'model__n_estimators': [50, 100, 200],
    'model__max_depth': [None, 10, 20, 30],
    'model__min_samples_split': [2, 5, 10],
    'model__min_samples_leaf': [1, 2, 4]
}

grid_search = GridSearchCV(estimator=pipeline, param_grid=param_grid, scoring='accuracy', cv=5)
grid_search.fit(X_train, y_train)
joblib.dump(grid_search, 'waterq_model.joblib')

best_model = grid_search.best_estimator_

print("Random Forest Classifier Best Parameters:", grid_search.best_params_)
print("Random Forest Classifier Best CV Score (Accuracy):", grid_search.best_score_)

y_pred = best_model.predict(X_test)


accuracy = accuracy_score(y_test, y_pred)
print("Random Forest Classifier Test Accuracy:", accuracy)


print("Classification Report:")
print(classification_report(y_test, y_pred))

import joblib
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', RandomForestClassifier(random_state=42))
])

param_grid = {
    'model__n_estimators': [50, 100, 200],
    'model__max_depth': [None, 10, 20, 30],
    'model__min_samples_split': [2, 5, 10],
    'model__min_samples_leaf': [1, 2, 4]
}

grid_search = GridSearchCV(estimator=pipeline, param_grid=param_grid, scoring='accuracy', cv=5)
grid_search.fit(X_train, y_train)
joblib.dump(pipeline, 'weather_model.joblib')


best_model = grid_search.best_estimator_

print("Random Forest Classifier Best Parameters:", grid_search.best_params_)
print("Random Forest Classifier Best CV Score (Accuracy):", grid_search.best_score_)

y_pred = best_model.predict(X_test)


accuracy = accuracy_score(y_test, y_pred)
print("Random Forest Classifier Test Accuracy:", accuracy)


print("Classification Report:")
print(classification_report(y_test, y_pred))