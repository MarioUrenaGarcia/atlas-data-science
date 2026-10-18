---
id: winsorizacion
titulo: Winsorización
titulo_en: Winsorization
alias:
  - winsorizing
  - recorte por percentiles
  - acotamiento de extremos
  - capping
modulo: 12
submodulo: '12.2'
orden: 13
nivel: basico
prerrequisitos:
  - valores-atipicos-vs-errores-de-captura
  - media-winsorizada
etiquetas:
  - valores atípicos
  - transformación
  - estadística robusta
  - limpieza
resumen: >
  Winsorizar una variable reemplaza los valores por debajo del percentil p por ese percentil y los que superan
  el percentil 1 - p por este otro. Conserva todas las filas y limita la influencia de los extremos en modelos y resúmenes.
formula: 'w_i = \min\big(\max(x_i,\ q_p),\ q_{1-p}\big)'
visualizacion:
  componente: DataQualityTable
  parametros:
    modo: winsorizacion
    p: 0.05
referencias:
  - clave: wasserman
  - clave: hastie-esl
publicado: true
---

## Intuición

Una inmobiliaria quiere relacionar el precio de las viviendas con su superficie. La mayoría cuesta entre 1 y 5 millones de pesos, pero unas cuantas residencias de lujo cuestan 15 o 20 millones. Esos precios son reales, no errores; aun así, en una regresión por mínimos cuadrados unos pocos puntos muy altos jalan la recta hacia ellos y el modelo describe mal a la gran mayoría de las casas.

**Winsorizar** es poner un techo y un piso a la variable: todo lo que supere el percentil 95 se baja al valor de ese percentil, y todo lo que quede por debajo del percentil 5 se sube al valor del percentil 5. Ninguna casa se elimina y el orden entre ellas se conserva en el centro; solo se acota cuánto puede pesar cada extremo. A diferencia de la media winsorizada, que es un resumen, aquí la transformación se aplica a la columna completa y los datos transformados se usan en cualquier análisis posterior.

## Definición

:::definicion[Winsorización por percentiles]
Dada una proporción $p \in [0, 0.5)$, sean $q_p$ y $q_{1-p}$ los cuantiles $p$ y $1 - p$ de la variable $x$. La variable **winsorizada** es

$$
w_i = \min\big(\max(x_i,\ q_p),\ q_{1-p}\big) = \begin{cases} q_p & \text{si } x_i < q_p, \\ x_i & \text{si } q_p \le x_i \le q_{1-p}, \\ q_{1-p} & \text{si } x_i > q_{1-p}. \end{cases}
$$
:::

Los cuantiles se calculan con los datos de entrenamiento y se aplican sin cambios a datos nuevos. Si solo preocupa una cola, se winsoriza solo esa.

:::nota[Qué significa cada símbolo]
- $x_i$: valor original de la fila $i$.
- $p$: proporción de cada cola que se acota, por ejemplo $0.05$.
- $q_p$, $q_{1-p}$: cuantiles $p$ y $1-p$ de la variable, que actúan como piso y techo.
- $w_i$: valor winsorizado.
- $\min$, $\max$: el menor y el mayor de dos números.
:::

## Cómo usar la visualización

El histograma muestra los precios actuales de 150 viviendas y el diagrama de dispersión, precio contra superficie. Al reproducir, los precios fuera de los límites se deslizan hasta el piso o el techo, marcados con líneas naranjas punteadas. La recta gris es la de mínimos cuadrados con los datos originales y la naranja, la de los datos actuales. Las lecturas comparan la media, la desviación estándar y la correlación antes y después.

Experimentos sugeridos: con $p = 0$ no cambia nada; con $p = 0.05$, la cola larga del histograma desaparece y la recta se aplana; con $p = 0.2$ se recorta demasiado y el histograma muestra picos en los dos límites.

## Ejemplo

Diez valores de gasto semanal en entretenimiento, en cientos de pesos: 3, 5, 6, 6, 7, 8, 8, 9, 10 y 45. Se winsoriza con $p = 0.1$, usando cuantiles por interpolación lineal.

1. $q_{0.1}$: posición $1 + 9(0.1) = 1.9$, entre el primero y el segundo valor: $3 + 0.9(5 - 3) = 4.8$.
2. $q_{0.9}$: posición $1 + 9(0.9) = 9.1$, entre el noveno y el décimo: $10 + 0.1(45 - 10) = 13.5$.
3. Se acotan dos valores: $3 \to 4.8$ y $45 \to 13.5$.
4. La media pasa de $107/10 = 10.7$ a $77.3/10 = 7.73$ y la desviación estándar, de 12.22 a 2.64.

El valor de 45 ya no domina la variable, pero sigue siendo el mayor: quien más gastaba sigue arriba.

:::figura[Viviendas winsorizadas al 5 % por cola: la cola larga de precios se acota, la desviación estándar baja y la recta deja de seguir a las residencias de lujo.]{componente="DataQualityTable"}
```yaml
modo: winsorizacion
p: 0.05
```
:::

## Propiedades

- **Conserva el tamaño de la muestra y el orden central.** Los valores entre $q_p$ y $q_{1-p}$ no cambian y los acotados empatan en el límite.
- **Reduce la varianza y la influencia de los extremos** en medias, correlaciones y coeficientes de regresión.

:::figura[Con 10 % por cola, la correlación entre superficie y precio cambia y la recta se estabiliza, a costa de muchos valores empatados en los límites.]{componente="DataQualityTable"}
```yaml
modo: winsorizacion
p: 0.1
```
:::

- **Es una transformación monótona no estricta.** Si $x_i \le x_j$ entonces $w_i \le w_j$, así que las medidas basadas en rangos, como la correlación de Spearman, casi no cambian.

## Errores comunes

- **Winsorizar errores de captura.** Un precio de 1250 millones por ceros de más no es un extremo que haya que acotar, es un error que hay que corregir; acotarlo deja un valor falso en el techo.
- **Calcular los límites con todos los datos.** Si los percentiles incluyen los datos de prueba, la información de la prueba se filtra al modelo; se calculan solo con el entrenamiento.
- **Elegir $p$ demasiado grande.** Con $p = 0.2$, el 40 % de los valores queda en dos límites y la variable pierde la información de sus colas.

:::figura[Error de elegir p demasiado grande: con 20 % por cola, el histograma se concentra en dos picos y la variable pierde casi toda su variación en los extremos.]{componente="DataQualityTable"}
```yaml
modo: winsorizacion
p: 0.2
```
:::

## Conexiones

Los límites son [[cuantiles-cuartiles-deciles-y-percentiles|percentiles]] de la variable, y el promedio de los datos winsorizados es la [[media-winsorizada]]. La winsorización solo tiene sentido para extremos legítimos, que se separan de los errores en [[valores-atipicos-vs-errores-de-captura]]. Reduce la [[varianza-muestral]] y la influencia de los extremos en el [[coeficiente-de-correlacion-de-pearson]], mientras que la [[correlacion-de-spearman]], basada en rangos, casi no cambia.

## Formulario

:::formula[Variable winsorizada]
$$
w_i = \min\big(\max(x_i,\ q_p),\ q_{1-p}\big)
$$

- $x_i$: valor original.
- $p$: proporción de cada cola que se acota.
- $q_p$, $q_{1-p}$: piso y techo, cuantiles de orden $p$ y $1 - p$ de la variable.
- $w_i$: valor acotado.
:::

:::formula[Cuantil por interpolación lineal]
$$
q_p = x_{(\lfloor h \rfloor)} + (h - \lfloor h \rfloor)\big(x_{(\lfloor h \rfloor + 1)} - x_{(\lfloor h \rfloor)}\big), \qquad h = 1 + (n - 1)p
$$

- $x_{(k)}$: $k$-ésimo valor al ordenar los datos.
- $n$: número de datos.
- $h$: posición fraccionaria del cuantil; $\lfloor h \rfloor$ es su parte entera.
:::
