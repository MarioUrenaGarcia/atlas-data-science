---
id: metricas-de-negocio-vs-metricas-del-modelo
titulo: Métricas de negocio vs métricas del modelo
titulo_en: Business metrics vs model metrics
alias:
  - métricas de negocio
  - métricas técnicas
  - valor de la decisión
  - análisis costo beneficio de un clasificador
modulo: 12
submodulo: '12.1'
orden: 4
nivel: basico
prerrequisitos:
  - de-la-pregunta-de-negocio-a-la-pregunta-analitica
  - pruebas-diagnosticas
etiquetas:
  - métricas
  - umbral de decisión
  - costo beneficio
  - evaluación
resumen: >
  Las métricas del modelo (exactitud, F1, sensibilidad) miden aciertos; las de negocio miden el valor de
  las decisiones que se toman con el modelo. Optimizar una no garantiza optimizar la otra.
formula: 'V(u) = v_{VP}\,VP(u) + v_{FP}\,FP(u) + v_{FN}\,FN(u) + v_{VN}\,VN(u)'
visualizacion:
  componente: DataProjectViz
  parametros:
    modo: metricas
    caso: retencion
    metrica: exactitud
referencias:
  - clave: kohavi
  - clave: james-isl
  - clave: murphy
publicado: true
---

## Intuición

Un modelo asigna a cada cliente una probabilidad de cancelar y la empresa ofrece un descuento a quienes superan un umbral. Si el umbral se elige para maximizar la exactitud, el modelo solo marca a los clientes en los que es casi seguro que cancelarán: se equivoca poco, pero deja pasar a muchos que se habrían quedado con el descuento. Retener a un cliente vale 400 pesos netos y una oferta mal dirigida cuesta 100; con esas cifras conviene ofrecer el descuento aunque la probabilidad de cancelar sea apenas de 25 %.

Las métricas del modelo cuentan aciertos y errores como si todos valieran lo mismo. Las métricas de negocio les ponen precio: un falso negativo puede costar una bomba descompuesta y un falso positivo, una revisión de rutina. Ambas son necesarias. Las primeras sirven para comparar modelos y detectar problemas técnicos; las segundas, para decidir cómo usar el modelo y si vale la pena usarlo.

## Definición

:::definicion[Valor de una regla de decisión]
Sea $u$ un umbral: se actúa sobre los casos con puntaje $s \ge u$. Los conteos $VP(u)$, $FP(u)$, $FN(u)$ y $VN(u)$ forman la matriz de confusión. Si cada resultado tiene un valor monetario $v_{VP}, v_{FP}, v_{FN}, v_{VN}$ relativo a no hacer nada, el **valor de la decisión** es

$$
V(u) = v_{VP}\,VP(u) + v_{FP}\,FP(u) + v_{FN}\,FN(u) + v_{VN}\,VN(u).
$$
:::

Las métricas del modelo más comunes son

$$
\text{exactitud} = \frac{VP + VN}{n}, \quad \text{precisión} = \frac{VP}{VP + FP}, \quad \text{sensibilidad} = \frac{VP}{VP + FN}, \quad F_1 = \frac{2\,VP}{2\,VP + FP + FN}.
$$

Si el puntaje es una probabilidad calibrada $p$, actuar conviene cuando el valor esperado de actuar supera al de no actuar, lo que da el **umbral de equilibrio**

$$
u^* = \frac{v_{VN} - v_{FP}}{(v_{VP} - v_{FN}) + (v_{VN} - v_{FP})}.
$$

:::nota[Qué significa cada símbolo]
- $s$: puntaje del modelo para un caso; aquí, probabilidad estimada de ser positivo.
- $u$: umbral de decisión; se actúa si $s \ge u$.
- $VP, FP, FN, VN$: verdaderos positivos, falsos positivos, falsos negativos y verdaderos negativos.
- $v_{VP}, v_{FP}, v_{FN}, v_{VN}$: valor de cada resultado, en pesos, comparado con no actuar.
- $n$: número total de casos.
- $V(u)$: valor total de la regla con umbral $u$.
- $u^*$: umbral a partir del cual actuar tiene mayor valor esperado que no actuar.
:::

## Cómo usar la visualización

La gráfica superior traza la métrica del modelo elegida en función del umbral y la inferior, el valor de la decisión en pesos. Al reproducir, ambas curvas se dibujan de izquierda a derecha; al terminar, un punto marca el máximo de cada una. La línea punteada es el umbral actual y la tabla inferior muestra la matriz de confusión con lo que aporta cada celda.

Experimentos sugeridos: mover el umbral hasta el máximo de la exactitud y leer el valor, y luego hasta el máximo del valor y leer la exactitud. Cambiar la métrica a sensibilidad y observar que siempre crece al bajar el umbral. Reducir la proporción de positivos y ver que el máximo de la exactitud se aleja del máximo del valor.

## Ejemplo

Una empresa tiene 1000 clientes, de los cuales 150 cancelarán. Con $v_{VP} = 400$, $v_{FP} = -100$ y $v_{FN} = v_{VN} = 0$:

1. Con $u = 0.5$ el modelo marca a 120 clientes: $VP = 90$, $FP = 30$, $FN = 60$, $VN = 820$. Exactitud $= 910/1000 = 0.91$; valor $= 90(400) - 30(100) = 33000$ pesos.
2. Con $u = 0.2$ marca a 280: $VP = 130$, $FP = 150$, $FN = 20$, $VN = 700$. Exactitud $= 830/1000 = 0.83$; valor $= 130(400) - 150(100) = 37000$ pesos.
3. El umbral de equilibrio es $u^* = \frac{0 - (-100)}{(400 - 0) + (0 - (-100))} = \frac{100}{500} = 0.2$.

Bajar el umbral reduce la exactitud en 8 puntos y aumenta el valor en 4000 pesos: los 40 clientes retenidos de más compensan las 120 ofertas adicionales mal dirigidas.

:::figura[Campaña de retención con el umbral en 0.2: la exactitud es menor que en su máximo, pero el valor de la decisión está cerca de su punto más alto.]{componente="DataProjectViz"}
```yaml
modo: metricas
caso: retencion
metrica: exactitud
umbral: 0.2
```
:::

## Propiedades

- **Con puntajes calibrados, la exactitud se maximiza cerca de $u = 0.5$** porque trata igual a ambos errores; el valor se maximiza cerca de $u^*$, que depende de la razón entre costos y beneficios.
- **Al bajar el umbral, la sensibilidad nunca disminuye y la precisión suele disminuir.** Ninguna de las dos, por sí sola, tiene un umbral óptimo útil: siempre se puede aumentar una sacrificando la otra.

:::figura[Propiedad de la sensibilidad en el mantenimiento de bombas: crece al bajar el umbral hasta marcar casi todas las bombas, mientras que el valor alcanza su máximo cerca de 0.07.]{componente="DataProjectViz"}
```yaml
modo: metricas
caso: mantenimiento
metrica: sensibilidad
```
:::

- **$F_1$ combina precisión y sensibilidad con pesos iguales.** Su umbral óptimo no considera cuánto vale cada error, así que en general tampoco coincide con el del valor.

:::figura[Revisión de transacciones: el máximo de F1 y el máximo del valor quedan en umbrales distintos porque detectar un fraude vale mucho más de lo que cuesta una revisión.]{componente="DataProjectViz"}
```yaml
modo: metricas
caso: fraude
metrica: f1
```
:::

## Errores comunes

- **Elegir el umbral por exactitud cuando los positivos son raros.** Con 3 % de fraudes, marcar casi nada da una exactitud de 0.97 y pierde casi todo el valor.
- **Reportar solo métricas del modelo a quien decide.** Un F1 de 0.6 no dice cuánto dinero gana o pierde la empresa; el valor en pesos sí.
- **Tomar los costos como exactos.** Los valores $v$ son estimaciones; conviene revisar cómo cambia el umbral óptimo si el costo de la oferta se duplica o el beneficio se reduce a la mitad.

:::figura[Error de optimizar la exactitud con positivos raros: con 3 % de fraudes, la exactitud casi no cambia entre umbrales altos, mientras que el valor cae al subir el umbral.]{componente="DataProjectViz"}
```yaml
modo: metricas
caso: fraude
metrica: exactitud
prevalencia: 0.03
```
:::

## Conexiones

Las celdas de la matriz de confusión son las mismas de las [[pruebas-diagnosticas]], donde la sensibilidad y la especificidad se estudian con detalle; el umbral de equilibrio es una aplicación de la [[probabilidad-condicional]] y del valor esperado. La métrica de éxito se fija durante el [[planteamiento-del-problema]] y se revisa en la fase de evaluación de la [[metodologia-crisp-dm]]. Elegir una regla que maximiza el valor esperado es un ejemplo de analítica prescriptiva, descrita en [[analitica-descriptiva-diagnostica-predictiva-y-prescriptiva]].

## Formulario

:::formula[Valor de la decisión]
$$
V(u) = v_{VP}\,VP(u) + v_{FP}\,FP(u) + v_{FN}\,FN(u) + v_{VN}\,VN(u)
$$

- $u$: umbral de decisión.
- $VP(u), FP(u), FN(u), VN(u)$: conteos de la matriz de confusión con ese umbral.
- $v_{VP}, v_{FP}, v_{FN}, v_{VN}$: valor de cada tipo de resultado.
:::

:::formula[Exactitud, precisión y sensibilidad]
$$
\text{exactitud} = \frac{VP + VN}{n}, \qquad \text{precisión} = \frac{VP}{VP + FP}, \qquad \text{sensibilidad} = \frac{VP}{VP + FN}
$$

- $n$: número total de casos.
- $VP, FP, FN, VN$: conteos de la matriz de confusión.
:::

:::formula[Puntuación F1]
$$
F_1 = \frac{2\,VP}{2\,VP + FP + FN}
$$

- $F_1$: media armónica de precisión y sensibilidad, entre $0$ y $1$.
- $VP, FP, FN$: verdaderos positivos, falsos positivos y falsos negativos.
:::

:::formula[Umbral de equilibrio]
$$
u^* = \frac{v_{VN} - v_{FP}}{(v_{VP} - v_{FN}) + (v_{VN} - v_{FP})}
$$

- $u^*$: probabilidad calibrada a partir de la cual conviene actuar.
- $v_{VP} - v_{FN}$: ganancia de actuar sobre un positivo.
- $v_{VN} - v_{FP}$: pérdida de actuar sobre un negativo.
:::
