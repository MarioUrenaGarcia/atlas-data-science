---
id: correccion-de-bessel
titulo: Corrección de Bessel
titulo_en: Bessel's correction
alias:
  - denominador n - 1
  - grados de libertad de la varianza
modulo: 4
submodulo: '4.3'
orden: 3
nivel: basico
prerrequisitos:
  - varianza-muestral
etiquetas:
  - varianza
  - sesgo
  - grados de libertad
  - estimación
resumen: >
  Dividir la suma de cuadrados entre n - 1 en lugar de n compensa que las desviaciones se midan desde
  la media muestral y no desde la poblacional; así la varianza muestral no subestima en promedio a σ².
formula: '\mathbb{E}\!\left[\frac{1}{n}\sum_{i=1}^{n}(X_i - \bar{X})^2\right] = \frac{n-1}{n}\,\sigma^2'
visualizacion:
  componente: DataStrip
  parametros:
    modo: bessel
    n: 4
    media: 50
    desviacion: 10
    variable: calificaciones
referencias:
  - clave: casella-berger
    capitulo: '5'
  - clave: wasserman
publicado: true
---

## Intuición

Para medir qué tan dispersos están los datos, lo natural sería promediar las desviaciones al cuadrado respecto a la media verdadera de la población. Pero esa media casi nunca se conoce: se usa la media de la propia muestra. Y la media de la muestra no es un punto cualquiera: es el punto que hace más pequeña la suma de cuadrados de esos datos. Medir desde ella siempre da una suma menor o igual que medir desde la media verdadera.

Por eso, si se divide entre $n$, el resultado sale sistemáticamente un poco más pequeño que la varianza real. La **corrección de Bessel** compensa esa pérdida dividiendo entre $n - 1$. Una forma de verlo: después de calcular la media, solo $n - 1$ desviaciones pueden variar libremente, porque la última queda determinada por la condición de que todas sumen cero. Con muestras grandes la diferencia entre $n$ y $n - 1$ es mínima; con muestras de 2 o 3 datos es enorme.

## Definición

:::teorema[Sesgo de la varianza con denominador n]
Si $X_1, \dots, X_n$ son independientes con media $\mu$ y varianza $\sigma^2$, entonces
$$
\mathbb{E}\!\left[\frac{1}{n}\sum_{i=1}^{n}(X_i - \bar{X})^2\right] = \frac{n-1}{n}\,\sigma^2,
\qquad
\mathbb{E}\!\left[S^2\right] = \mathbb{E}\!\left[\frac{1}{n-1}\sum_{i=1}^{n}(X_i - \bar{X})^2\right] = \sigma^2.
$$
:::

Se dice que $S^2$ es un estimador **insesgado** de $\sigma^2$, mientras que la versión con $n$ tiene un sesgo de $-\sigma^2/n$. El número $n - 1$ se llama **grados de libertad** de la suma de cuadrados.

:::figura[El caso extremo n = 2, con pesos de manzanas de una población con desviación estándar de 20 g. La varianza con denominador n converge a la mitad de σ².]{componente="DataStrip"}
```yaml
modo: bessel
n: 2
media: 150
desviacion: 20
variable: peso de manzanas
```
:::

:::nota[Qué significa cada símbolo]
- $X_1, \dots, X_n$: observaciones de una muestra aleatoria, tratadas como variables aleatorias.
- $\bar{X}$: media muestral.
- $\mu$: media de la población; $\sigma^2$: su varianza.
- $\mathbb{E}[\cdot]$: valor esperado, el promedio sobre todas las muestras posibles.
- $S^2$: varianza muestral con denominador $n - 1$.
- $\frac{n-1}{n}$: factor por el que la varianza con denominador $n$ subestima a $\sigma^2$ en promedio.
- $n$: tamaño de la muestra.
:::

## Cómo usar la visualización

Cada paso toma una nueva muestra de 4 calificaciones de una población con media 50 y desviación estándar 10, es decir, $\sigma^2 = 100$. Para cada muestra se calculan dos varianzas, una dividiendo entre $n$ y otra entre $n - 1$, y se grafica el promedio acumulado de cada una. La línea discontinua es $\sigma^2$.

Después de unas decenas de muestras, el promedio con $n - 1$ oscila alrededor de 100 y el promedio con $n$ alrededor de 75, que es $\frac{3}{4} \cdot 100$, como predice el encabezado. Al subir el tamaño de muestra a 30, las dos curvas casi se juntan; al bajarlo a 2, la versión con $n$ queda en la mitad.

## Ejemplo

Una población tiene solo tres valores igualmente probables: 1, 2 y 3. Su media es $\mu = 2$ y su varianza $\sigma^2 = \frac{(1-2)^2 + 0 + (3-2)^2}{3} = \frac{2}{3}$.

Se toman muestras de tamaño 2 con reemplazo; hay 9 posibles. Para una muestra $(a, b)$, la suma de cuadrados es $\frac{(a - b)^2}{2}$, así que la varianza con $n$ vale $\frac{(a-b)^2}{4}$ y la varianza con $n - 1$ vale $\frac{(a-b)^2}{2}$.

1. Los valores de $(a - b)^2$ en las 9 muestras son 0, 1, 4, 1, 0, 1, 4, 1, 0, que suman 12.
2. Promedio de la varianza con $n$: $\frac{12/4}{9} = \frac{1}{3}$, la mitad de $\sigma^2$.
3. Promedio de la varianza con $n - 1$: $\frac{12/2}{9} = \frac{2}{3} = \sigma^2$.

:::figura[Una de las nueve muestras del ejemplo, (1, 3): su varianza con n - 1 es 2 y con n es 1. Promediando sobre las nueve muestras, solo la primera coincide con σ² = 2/3.]{componente="DataStrip"}
```yaml
modo: dispersion
datos: [1, 3]
medida: varianza
lecturas: [varianza, varianza-n]
cuadrados: true
variable: Valor de la muestra
decimales: 0
dominio: [0, 4]
```
:::

## Propiedades

- **El sesgo desaparece con $n$:** la diferencia relativa entre ambas versiones es $1/n$; con 100 datos es de 1 %.
- **La raíz no es insesgada:** aunque $\mathbb{E}[S^2] = \sigma^2$, la desviación estándar $S$ subestima ligeramente a $\sigma$, porque la raíz es una función cóncava.
- **Media conocida:** si se conoce $\mu$ y se mide desde ella, $\frac{1}{n}\sum(X_i - \mu)^2$ ya es insesgada y no se corrige.
- **Error cuadrático:** la versión con $n$ tiene sesgo pero menor varianza; con datos normales, dividir entre $n + 1$ minimiza el error cuadrático medio. Insesgado no significa necesariamente más preciso.

:::demostracion
Escribimos $\sum (X_i - \bar{X})^2 = \sum (X_i - \mu)^2 - n(\bar{X} - \mu)^2$. Tomando esperanzas, $\mathbb{E}\sum (X_i - \mu)^2 = n\sigma^2$ y $\mathbb{E}[n(\bar{X} - \mu)^2] = n \cdot \frac{\sigma^2}{n} = \sigma^2$, porque la varianza de la media es $\sigma^2/n$. Por lo tanto $\mathbb{E}\sum (X_i - \bar{X})^2 = (n - 1)\sigma^2$, y dividiendo entre $n - 1$ se obtiene $\sigma^2$.
:::

:::figura[Propiedad de desaparición del sesgo: con muestras de 30 calificaciones, el factor es 29/30 y las dos curvas casi coinciden.]{componente="DataStrip"}
```yaml
modo: bessel
n: 30
media: 50
desviacion: 10
variable: calificaciones
```
:::

## Errores comunes

- **Creer que $n - 1$ es un ajuste arbitrario.** Es la corrección exacta del sesgo que produce medir desde $\bar{x}$.
- **Aplicarla cuando se tiene toda la población.** Con un censo, la varianza de la población se calcula con $N$; no hay nada que estimar.
- **Esperar que cada muestra individual quede más cerca de $\sigma^2$.** La corrección actúa en promedio sobre muchas muestras; una muestra concreta puede quedar lejos con cualquiera de los dos denominadores.

:::figura[Una muestra concreta puede fallar con cualquier denominador: con n = 5, los puntos de cada muestra individual se dispersan mucho alrededor de σ², aunque el promedio acumulado con n - 1 termina en 100.]{componente="DataStrip"}
```yaml
modo: bessel
n: 5
media: 50
desviacion: 10
variable: calificaciones
semilla: 2024
```
:::

## Conexiones

La corrección define el denominador de la [[varianza-muestral]] y, por extensión, de la [[desviacion-estandar-muestral]]. La noción de estimador insesgado se apoya en la distinción entre [[parametro-y-estadistico|parámetro y estadístico]] y en el hecho de que la [[media-aritmetica]] minimiza la suma de cuadrados. Los grados de libertad reaparecen en la distribución t de Student y en el análisis de varianza.

## Formulario

:::formula[Esperanza con denominador n]
$$
\mathbb{E}\!\left[\frac{1}{n}\sum_{i=1}^{n}(X_i - \bar{X})^2\right] = \frac{n-1}{n}\,\sigma^2
$$

- $X_i$: observaciones; $\bar{X}$: su media.
- $\sigma^2$: varianza poblacional.
- $n$: tamaño de muestra.
:::

:::formula[Varianza insesgada]
$$
S^2 = \frac{1}{n-1}\sum_{i=1}^{n}(X_i - \bar{X})^2, \qquad \mathbb{E}[S^2] = \sigma^2
$$

- $S^2$: varianza muestral con corrección de Bessel.
- $n - 1$: grados de libertad.
:::

:::formula[Descomposición de la suma de cuadrados]
$$
\sum_{i=1}^{n}(X_i - \bar{X})^2 = \sum_{i=1}^{n}(X_i - \mu)^2 - n(\bar{X} - \mu)^2
$$

- $\mu$: media poblacional.
- $n(\bar{X} - \mu)^2$: lo que se pierde por medir desde $\bar{X}$.
:::

:::formula[Sesgo de la versión con n]
$$
\mathbb{E}\!\left[\hat{\sigma}^2_n\right] - \sigma^2 = -\frac{\sigma^2}{n}
$$

- $\hat{\sigma}^2_n$: varianza con denominador $n$.
:::
