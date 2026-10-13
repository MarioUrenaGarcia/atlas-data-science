---
id: desviacion-estandar
titulo: Desviación estándar
titulo_en: Standard deviation
alias:
  - desviación típica
  - sigma
  - raíz de la varianza
modulo: 1
submodulo: '1.3'
orden: 14
nivel: basico
prerrequisitos:
  - varianza
relaciones:
  - tipo: relacionado
    id: desviacion-estandar-muestral
  - tipo: relacionado
    id: puntuaciones-z-muestrales
  - tipo: relacionado
    id: coeficiente-de-variacion
etiquetas:
  - dispersión
  - escala
  - unidades originales
  - estandarización
  - regla 68-95-99.7
resumen: >
  La desviación estándar es la raíz cuadrada de la varianza. Mide la dispersión en las mismas
  unidades que la variable y funciona como la escala natural para decir si un valor está cerca o
  lejos de la media.
formula: '\sigma = \sqrt{\operatorname{Var}(X)} = \sqrt{\mathbb{E}\big[(X - \mu)^2\big]}'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: varianza
    distribucion: normal
    parametros:
      mu: 0
      sigma: 1
    a: 2
    b: 1
referencias:
  - clave: blitzstein-hwang
    capitulo: '4.6'
  - clave: ross-probabilidad
    capitulo: '4.5'
publicado: true
---

## Intuición

La varianza de un tiempo de entrega medido en minutos está en minutos al cuadrado, una unidad difícil de interpretar. Tomando la raíz se regresa a minutos: la **desviación estándar** es una distancia típica a la media, en las mismas unidades que la variable.

Con ella se puede hablar de "qué tan raro" es un valor. Estar 10 minutos por encima de la media es mucho si la desviación estándar es 2 minutos, y es normal si es 15. Por eso es habitual medir distancias en desviaciones estándar: el valor $z = (x - \mu)/\sigma$ dice a cuántas desviaciones de la media está $x$, sin importar las unidades originales.

## Definición

:::definicion[Desviación estándar]
Sea $X$ una variable aleatoria con varianza finita. Su **desviación estándar** es
$$
\sigma_X = \sqrt{\operatorname{Var}(X)} = \sqrt{\mathbb{E}\big[(X - \mu)^2\big]}.
$$
La **variable estandarizada** es
$$
Z = \frac{X - \mu}{\sigma_X},
$$
que tiene media 0 y desviación estándar 1.
:::

La desviación estándar no es el promedio de las distancias $|X - \mu|$: por ser la raíz de un promedio de cuadrados, siempre es mayor o igual que ese promedio, $\sigma \ge \mathbb{E}|X - \mu|$.

:::figura[En una normal, el intervalo de una desviación estándar alrededor de la media contiene cerca del 68.3 % de la probabilidad.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 0
  sigma: 1
desde: -1
hasta: 1
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria con media $\mu$.
- $\sigma_X$, $\sigma$: desviación estándar de $X$.
- $\operatorname{Var}(X)$: varianza.
- $Z$: variable estandarizada.
- $z = (x - \mu)/\sigma$: distancia a la media medida en desviaciones estándar.
- $k$: número de desviaciones estándar.
- $D_A$, $D_B$: desviaciones del llenado de cada máquina en el ejemplo, en mililitros.
:::

## Cómo usar la visualización

Arriba está una normal estándar con la banda de una desviación estándar alrededor de la media; en medio, las contribuciones de cada franja a la varianza; abajo, la transformación $Y = aX + b$. Con $a = 2$ la banda de abajo es el doble de ancha y la desviación estándar pasa de 1 a 2, mientras que la varianza pasa de 1 a 4.

Al mover $b$ la distribución se desplaza sin cambiar su ancho. Con $a$ negativo la distribución se refleja, pero la desviación estándar es $|a|$ veces la original: nunca es negativa.

## Ejemplo

Dos máquinas llenan botellas de 500 mililitros. La desviación $D_A$ del contenido respecto a 500 es normal con media 0 y desviación estándar 1 en la máquina A, y $D_B$ es normal con media 0 y desviación estándar 2.5 en la máquina B. Una botella se rechaza si se desvía más de 3 mililitros.

1. En A, 3 mililitros son $z = 3/1 = 3$ desviaciones estándar: $P(|D_A| > 3) \approx 0.0027$.
2. En B, son $z = 3/2.5 = 1.2$ desviaciones estándar: $P(|D_B| > 3) = 2(1 - \Phi(1.2)) \approx 2 \cdot 0.1151 = 0.230$.
3. Con el mismo promedio, la máquina B rechaza cerca de 85 veces más botellas.

:::figura[El ejemplo de las máquinas: la curva baja y ancha es la máquina B, y el área fuera de la franja de $-3$ a 3 es su proporción de rechazos, cerca de 23 %. La curva alta es la máquina A.]{componente="DistributionExplorer"}
```yaml
distribucion: normal
valores:
  mu: 0
  sigma: 2.5
fijos: [mu]
desde: -3
hasta: 3
referencia:
  distribucion: normal
  valores:
    mu: 0
    sigma: 1
  etiqueta: Máquina A
```
:::

## Propiedades

- **Escala:** $\sigma_{aX + b} = |a|\,\sigma_X$; la desviación estándar cambia con las unidades y no con los desplazamientos.
- **Suma de independientes:** $\sigma_{X + Y} = \sqrt{\sigma_X^2 + \sigma_Y^2}$, que es menor que $\sigma_X + \sigma_Y$.
- **Regla de la normal:** en una normal, los intervalos de 1, 2 y 3 desviaciones estándar alrededor de la media contienen cerca del 68.3 %, 95.4 % y 99.7 % de la probabilidad.
- **Cota universal:** para cualquier distribución con varianza finita, $P(|X - \mu| \ge k\sigma) \le 1/k^2$ (desigualdad de Chebyshev).

:::figura[En una distribución asimétrica, la banda de una desviación estándar no queda centrada en la masa: en la exponencial de media 1, la desviación estándar también es 1, y la banda va de 0 a 2.]{componente="RandomVariableLab"}
```yaml
modo: forma
distribucion: exponencial
parametros:
  lambda: 1
orden: 2
```
:::

## Errores comunes

- **Aplicar la regla 68-95-99.7 a cualquier distribución.** En una uniforme, la banda de una desviación estándar contiene solo el 57.7 % de la probabilidad; en distribuciones con colas pesadas, a veces más del 68 %.
- **Sumar desviaciones estándar.** Para variables independientes se suman las varianzas y luego se toma la raíz.
- **Confundirla con la desviación media.** $\mathbb{E}|X - \mu|$ es otra medida de dispersión, menor o igual que $\sigma$.

:::figura[En la uniforme entre 0 y 1, la desviación estándar es $1/\sqrt{12} \approx 0.289$, y el intervalo de 0.211 a 0.789 contiene solo el 57.7 % de la probabilidad, no el 68 %.]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme
valores:
  a: 0
  b: 1
fijos: [a, b]
desde: 0.211
hasta: 0.789
```
:::

## Conexiones

La desviación estándar es la raíz de la [[varianza]] y comparte sus [[propiedades-de-la-varianza]], traducidas a unidades originales. Su versión con datos es la [[desviacion-estandar-muestral]], la estandarización da las [[puntuaciones-z-muestrales]] y el cociente entre desviación y media es el [[coeficiente-de-variacion]]. La desigualdad de Chebyshev, del submódulo de desigualdades, da una cota en desviaciones estándar que vale para cualquier distribución. En el [[teorema-central-del-limite]] el promedio se estandariza dividiendo entre $\sigma / \sqrt{n}$.

## Formulario

:::formula[Definición]
$$
\sigma_X = \sqrt{\operatorname{Var}(X)}
$$

- En las mismas unidades que $X$.
:::

:::formula[Estandarización]
$$
Z = \frac{X - \mu}{\sigma_X}, \qquad \mathbb{E}[Z] = 0, \qquad \sigma_Z = 1
$$

- $Z$ mide distancias a la media en desviaciones estándar.
:::

:::formula[Transformación afín]
$$
\sigma_{aX + b} = |a|\,\sigma_X
$$

- El desplazamiento no cambia la dispersión.
:::

:::formula[Suma de independientes]
$$
\sigma_{X + Y} = \sqrt{\sigma_X^2 + \sigma_Y^2}
$$

- Se suman varianzas, no desviaciones.
:::
