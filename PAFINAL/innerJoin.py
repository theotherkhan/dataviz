

import pandas as pd

a = pd.read_csv("GermanyTerrorismRAW.csv")
b = pd.read_csv("towns.csv")

print a.head()
print "\n------------------------------ \n", b.head()

b = b.dropna(axis=1)
merged = a.merge(b, on='CITY')
print merged.head()
merged.to_csv("town_terrorism.csv", index=False)
