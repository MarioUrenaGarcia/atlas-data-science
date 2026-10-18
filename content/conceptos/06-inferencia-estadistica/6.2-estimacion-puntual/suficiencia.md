---
id: suficiencia
titulo: Suficiencia
titulo_en: Sufficiency
alias:
  - estadístico suficiente
  - suficiencia de un estadístico
modulo: 6
submodulo: '6.2'
orden: 9
nivel: intermedio
prerrequisitos:
  - estimador-y-estimacion
  - probabilidad-condicional
etiquetas:
  - inferencia
  - suficiencia
  - reducción de datos
  - estadísticos
resumen: >
  Un estadístico es suficiente para un parámetro si, una vez conocido su valor, la distribución del resto
  de la muestra ya no depende del parámetro. Resume toda la información que la muestra tiene sobre él.
formula: 'P_\theta(\mathbf{X} = \mathbf{x} \mid T(\mathbf{X}) = t)\ \text{no depende de } \theta'
visualizacion:
  componente: SufficiencyLab
  parametros:
    modo: suficiencia
    n: 4
    particion: suma
referencias:
  - clave: casella-berger
    capitulo: '6'
  - clave: wasserman
publicado: true
---

## Intuición

Un control de calidad revisa 4 piezas y anota cuáles salen defectuosas, en orden: por ejemplo, bien, defecto, bien, defecto. Para estimar la tasa de defectos $p$, ¿importa el orden, o basta con saber que hubo 2 defectos de 4? Intuitivamente basta el total. La razón precisa es esta: si se sabe que hubo 2 defectos, las 6 maneras de acomodarlos son igualmente probables, sea cual sea $p$. Una vez conocido el total, el orden es puro azar sin información sobre $p$.

Un estadístico con esa propiedad se llama **suficiente**: comprime los datos sin perder nada de lo que dicen sobre el parámetro. Dos analistas, uno con la secuencia completa y otro solo con el total, pueden hacer exactamente las mismas inferencias sobre $p$. La suficiencia es la base de la reducción de datos en estadística.

## Definición

:::definicion[Estadístico suficiente]
Un estadístico $T = T(\mathbf{X})$ es **suficiente** para $\theta$ si la distribución condicional de la muestra $\mathbf{X} = (X_1, \dots, X_n)$ dado $T$ no depende de $\theta$:
$$
P_\theta(\mathbf{X} = \mathbf{x} \mid T(\mathbf{X}) = t)\ \text{es la misma para todo } \theta,
$$
para todo $t$ (con densidades en el caso continuo).
:::

Ejemplo canónico: si $X_1, \dots, X_n$ son Bernoulli($p$) independientes, $T = \sum X_i$ es suficiente, porque
$$
P_p\Big(\mathbf{X} = \mathbf{x} \,\Big|\, \sum X_i = t\Big) = \frac{p^t(1 - p)^{n - t}}{\binom{n}{t}p^t(1 - p)^{n - t}} = \frac{1}{\binom{n}{t}}.
$$

:::nota[Qué significa cada símbolo]
- $\mathbf{X} = (X_1, \dots, X_n)$: la muestra como vector; $\mathbf{x}$: un valor posible.
- $T(\mathbf{X})$: el estadístico; $t$: un valor suyo.
- $\theta$: parámetro; $p$: probabilidad de éxito en el ejemplo Bernoulli.
- $P_\theta(\cdot \mid \cdot)$: probabilidad condicional bajo el valor $\theta$.
- $\binom{n}{t}$: número de secuencias con $t$ éxitos.
:::

## Cómo usar la visualización

Se muestran las 16 secuencias posibles de 4 ensayos, agrupadas según el estadístico elegido. A la izquierda van las etiquetas de cada grupo; a la derecha de cada secuencia, dos barras: su probabilidad (relativa a la más probable) y, en color, su probabilidad dentro de su grupo. Al reproducir, $p$ recorre de 0.1 a 0.9.

Controles: **Número de ensayos** y **Estadístico que agrupa las secuencias**.

Experimentos sugeridos:

1. Con el número de éxitos: las barras grises cambian con $p$, pero las de color no; el panel dice que el estadístico es suficiente.
2. Elegir "solo el primer resultado": las barras de color cambian con $p$; no es suficiente.
3. Elegir "secuencia completa": cada grupo tiene una sola secuencia, con probabilidad condicional 1; es suficiente pero no reduce nada.

## Ejemplo

Cuatro piezas con resultado bien (0), defecto (1), bien (0), defecto (1); $T = 2$.

1. Con $p = 0.2$: $P(0101) = 0.2^2 \cdot 0.8^2 = 0.0256$ y $P(T = 2) = 6 \cdot 0.0256 = 0.1536$; la condicional es $1/6$.
2. Con $p = 0.7$: $P(0101) = 0.49 \cdot 0.09 = 0.0441$ y $P(T = 2) = 0.2646$; la condicional sigue siendo $1/6$.
3. Con el estadístico "primer resultado" $X_1 = 0$: $P(0101 \mid X_1 = 0) = P(101) = p^2(1 - p)$, que vale 0.032 con $p = 0.2$ y 0.147 con $p = 0.7$. Depende de $p$: no es suficiente.

:::figura[El estadístico insuficiente del ejemplo: agrupar solo por el primer resultado deja probabilidades condicionales que cambian con p.]{componente="SufficiencyLab"}
```yaml
modo: suficiencia
n: 4
particion: primero
```
:::

## Propiedades

- **No es único:** cualquier función biyectiva de un estadístico suficiente también lo es, y la muestra completa siempre es suficiente.
- **Criterio práctico:** el teorema de factorización de Fisher-Neyman permite reconocerlo sin calcular condicionales.
- **Inferencias equivalentes:** salvo un factor $h(\mathbf{x})$ que no depende de $\theta$, la verosimilitud depende de los datos solo a través de $T$, así que cualquier método basado en la verosimilitud usa solo $T$.

:::figura[Una partición más fina que el total: el número de éxitos junto con el primer resultado también es suficiente, pero no reduce tanto como el total solo.]{componente="SufficiencyLab"}
```yaml
modo: suficiencia
n: 5
particion: suma-y-primero
```
:::

## Errores comunes

- **Creer que el estadístico suficiente es el estimador.** $T$ resume la información; el estimador es una función de $T$ (por ejemplo, $T/n$).
- **Pensar que siempre existe uno de dimensión pequeña.** Para la distribución de Cauchy no hay ninguno más simple que la muestra ordenada.
- **Confundir suficiencia con insesgadez.** Son propiedades distintas: una trata de información, la otra del promedio de un estimador.

:::figura[Cuando no existe un suficiente más simple, como en la Cauchy, hay que conservar la muestra completa: siempre es suficiente, pero no comprime nada, como se ve aquí con 3 ensayos de Bernoulli.]{componente="SufficiencyLab"}
```yaml
modo: suficiencia
n: 3
particion: completa
```
:::

## Conexiones

La suficiencia se reconoce con el [[teorema-de-factorizacion-de-fisher-neyman]] y su versión más compacta es la [[suficiencia-minima]]. Usa la [[probabilidad-condicional]] y es la base del [[teorema-de-rao-blackwell]], que mejora estimadores condicionando en un estadístico suficiente.

## Formulario

:::formula[Definición de suficiencia]
$$
P_\theta(\mathbf{X} = \mathbf{x} \mid T(\mathbf{X}) = t)\ \text{no depende de } \theta
$$

- $\mathbf{X}$: muestra; $T$: estadístico; $\theta$: parámetro.
:::

:::formula[Caso Bernoulli]
$$
P_p\Big(\mathbf{X} = \mathbf{x} \,\Big|\, \sum_{i=1}^{n} X_i = t\Big) = \frac{1}{\binom{n}{t}}
$$

- $p$: probabilidad de éxito; $t$: número de éxitos; $n$: número de ensayos.
:::
