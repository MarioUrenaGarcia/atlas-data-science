---
id: principio-de-maxima-entropia
titulo: Principio de máxima entropía
titulo_en: Principle of maximum entropy
alias:
  - máxima entropía
  - MaxEnt
  - principio de Jaynes
modulo: 0
submodulo: '0.8'
orden: 11
nivel: intermedio
prerrequisitos:
  - entropia-de-shannon
  - multiplicadores-de-lagrange
relaciones:
  - tipo: relacionado
    id: entropia-diferencial
etiquetas:
  - máxima entropía
  - distribuciones
  - restricciones
  - familia exponencial
resumen: >
  Entre todas las distribuciones que cumplen lo que se sabe, se elige la de mayor entropía: la que no
  agrega supuestos. Con restricciones de esperanza, la solución tiene forma exponencial.
formula: '\max_p H(p) \text{ sujeto a } \sum_x p(x) f(x) = c \;\Longrightarrow\; p(x) = \frac{e^{\lambda f(x)}}{\sum_{y} e^{\lambda f(y)}}'
visualizacion:
  componente: InformationViz
  parametros:
    modo: maxent
referencias:
  - clave: cover-thomas
    capitulo: '12'
  - clave: mcelreath
publicado: true
---

## Intuición

Un dado se lanzó muchas veces y solo se sabe que el promedio de las caras fue 4.5, no 3.5 como en un dado justo. Hay infinitas distribuciones de las seis caras con ese promedio: por ejemplo, la que solo produce cuatros y cincos, o la que reparte por igual entre 3, 4, 5 y 6. Elegir cualquiera de ellas equivale a afirmar cosas que los datos no dicen, como que el uno es imposible.

El principio de máxima entropía propone elegir, entre todas las distribuciones compatibles con lo que se sabe, la más incierta. Esa distribución respeta la información disponible y no agrega nada más: cualquier otra elección tendría menor entropía, es decir, supondría información adicional que no se tiene.

Para el dado, la respuesta da probabilidad positiva a todas las caras y la hace crecer de forma geométrica hacia el seis. Sin ninguna restricción además de sumar 1, la respuesta es la uniforme.

## Definición

:::definicion[Principio de máxima entropía]
Sean $f_1, \dots, f_m$ funciones sobre un conjunto finito $\mathcal{X}$ y $c_1, \dots, c_m$ valores conocidos de sus esperanzas. La distribución de máxima entropía es la solución de
$$
\max_{p} H(p) \quad \text{sujeto a} \quad \sum_{x} p(x) = 1, \quad \sum_{x} p(x) f_j(x) = c_j, \ j = 1, \dots, m.
$$
Si existe, tiene la forma de Gibbs
$$
p(x) = \frac{1}{Z(\boldsymbol{\lambda})} \exp\Big(\sum_{j=1}^{m} \lambda_j f_j(x)\Big), \qquad Z(\boldsymbol{\lambda}) = \sum_{y} \exp\Big(\sum_{j} \lambda_j f_j(y)\Big),
$$
con multiplicadores $\lambda_j$ elegidos para que se cumplan las restricciones.
:::

La forma se obtiene con multiplicadores de Lagrange: la derivada del lagrangiano respecto de $p(x)$ es $-\log p(x) - 1 + \lambda_0 + \sum_j \lambda_j f_j(x)$, y al igualarla a cero resulta la exponencial.

:::nota[Qué significa cada símbolo]
- $\mathcal{X}$: conjunto de valores posibles.
- $p$: distribución que se busca; $H(p)$: su entropía.
- $f_j$: funciones cuyas esperanzas se conocen; $c_j$: esos valores.
- $m$: número de restricciones.
- $\lambda_j$: multiplicadores de Lagrange; $\boldsymbol{\lambda}$: el vector de todos ellos; $\lambda_0$: multiplicador de la restricción de suma 1.
- $Z(\boldsymbol{\lambda})$: constante de normalización.
:::

## Cómo usar la visualización

Las barras son la distribución de máxima entropía sobre las caras 1 a 6 de un dado cuya media se fija, con su probabilidad escrita encima. El encabezado muestra la forma exponencial, el multiplicador $\lambda$ que cumple la restricción y la entropía. La reproducción mueve la media exigida de 1.5 a 5.5 en pasos de 0.1.

Con media 1.5 la distribución cae de forma geométrica desde el uno (0.664, 0.224, 0.075, ...) y la entropía es 1.375 bits. En la media 3.5 las barras se igualan, $\lambda = 0$ y la entropía alcanza su máximo de 2.585 bits. Después la inclinación se invierte de forma simétrica.

## Ejemplo

Se busca la distribución de máxima entropía de un dado con media 4.5.

1. La forma es $p(k) \propto e^{\lambda k}$, $k = 1, \dots, 6$, una progresión geométrica de razón $r = e^{\lambda}$.
2. Se elige $\lambda$ para que $\sum_k k\,p(k) = 4.5$; numéricamente, $\lambda = 0.371$ y $r = 1.449$.
3. Resultado: $p = (0.054, 0.079, 0.114, 0.165, 0.240, 0.347)$, con $H = 2.328$ bits.
4. Comparación: la uniforme en $\{3, 4, 5, 6\}$ también tiene media 4.5, pero su entropía es 2 bits; la que solo produce cuatros y cincos tiene 1 bit.

:::figura[Media fija en 4.5: el multiplicador es 0.371, la cara seis recibe 0.347 y la uno 0.054, y la entropía es 2.328 bits; desde ahí la animación sube la media hasta 5.5.]{componente="InformationViz"}
```yaml
modo: maxent
media: 4.5
```
:::

## Propiedades

- **Sin restricciones, uniforme:** en un conjunto de $k$ valores, la distribución de máxima entropía es la uniforme, con $H = \log_2 k$.
- **Familia exponencial:** las restricciones de esperanza producen distribuciones de la familia exponencial con estadísticos suficientes $f_j$.
- **Ejemplos continuos:** en $[0, \infty)$ con media fija, la exponencial; en $\mathbb{R}$ con media y varianza fijas, la normal; en un intervalo acotado sin más restricciones, la uniforme.
- **Simetría:** en el dado, fijar la media en $7 - c$ produce la distribución reflejada de la que corresponde a $c$, con la misma entropía.

:::figura[Media fija en 2.5, el reflejo de 4.5: las probabilidades son las mismas en orden inverso, el multiplicador es $-0.371$ y la entropía vuelve a ser 2.328 bits.]{componente="InformationViz"}
```yaml
modo: maxent
media: 2.5
```
:::

- **Unicidad:** como la entropía es estrictamente cóncava y las restricciones son lineales, la solución, si existe, es única.

## Errores comunes

- **Creer que la máxima entropía dice que el dado es justo.** Solo lo dice si la única información es que las probabilidades suman 1. En cuanto se conoce una media distinta de 3.5, la respuesta deja de ser uniforme.

:::figura[Media fija en 3.5, la del dado justo: el multiplicador es cero, las seis barras valen 1/6 y la entropía es el máximo de 2.585 bits; cualquier otra media la reduce.]{componente="InformationViz"}
```yaml
modo: maxent
media: 3.5
```
:::

- **Agregar restricciones que no se conocen.** La distribución resultante es tan buena como la información que se impone; restricciones inventadas producen conclusiones inventadas.
- **Aplicarlo con variables continuas sin cuidado.** La entropía diferencial depende de la escala, así que la respuesta depende de la medida de referencia elegida.
- **Confundirlo con elegir la distribución más probable de los datos.** Es un criterio para asignar probabilidades con información parcial, no un estimador de máxima verosimilitud, aunque en familias exponenciales coinciden.

## Conexiones

Maximiza la [[entropia-de-shannon]] con restricciones lineales, un problema que se resuelve con [[multiplicadores-de-lagrange]]. Con densidades usa la [[entropia-diferencial]], y explica por qué la normal y la exponencial aparecen como modelos por defecto. La forma de Gibbs que produce es la misma de la softmax que se calcula con el [[truco-log-sum-exp]].

## Formulario

:::formula[Problema de máxima entropía]
$$
\max_p H(p) \quad \text{sujeto a} \quad \sum_x p(x) = 1, \ \sum_x p(x) f_j(x) = c_j
$$

- $H(p)$: entropía; $f_j$: funciones con esperanza conocida; $c_j$: valores de esas esperanzas.
:::

:::formula[Forma de Gibbs]
$$
p(x) = \frac{1}{Z(\boldsymbol{\lambda})}\exp\Big(\sum_j \lambda_j f_j(x)\Big)
$$

- $\lambda_j$: multiplicadores de Lagrange; $Z(\boldsymbol{\lambda})$: constante que hace sumar 1 a las probabilidades.
:::

:::formula[Dado con media fija]
$$
p(k) = \frac{e^{\lambda k}}{\sum_{j=1}^{6} e^{\lambda j}}, \qquad \sum_{k=1}^{6} k\,p(k) = \bar{k}
$$

- $k$: cara del dado; $\lambda$: multiplicador; $\bar{k}$: media exigida.
:::
