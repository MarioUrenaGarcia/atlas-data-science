---
id: distribucion-de-kumaraswamy
titulo: Distribución de Kumaraswamy
titulo_en: Kumaraswamy distribution
alias:
  - Kumaraswamy
  - doble acotada
modulo: 2
submodulo: '2.2'
orden: 30
nivel: avanzado
prerrequisitos:
  - distribucion-beta
relaciones:
  - tipo: contrasta
    id: distribucion-beta
etiquetas:
  - intervalo [0, 1]
  - proporciones
  - función de distribución explícita
  - hidrología
resumen: >
  Distribución en [0, 1] parecida a la beta pero con función de distribución y cuantiles en forma cerrada,
  F(x) = 1 - (1 - x^a)^b. Con a y b enteros es el menor de b máximos de a uniformes.
formula: 'F(x) = 1 - (1 - x^{a})^{b}, \quad 0 \le x \le 1'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: kumaraswamy
      valores:
        a: 2
        b: 3
      casos:
        - nombre: 'Uniforme'
          descripcion: 'a = b = 1: F(x) = x, la uniforme en [0, 1].'
          valores: {a: 1, b: 1}
        - nombre: 'Llenado de una presa'
          descripcion: 'a = 2 y b = 3: el nivel relativo de llenado suele estar entre 0.2 y 0.7, con más masa en la mitad baja.'
          valores: {a: 2, b: 3}
        - nombre: 'Máximo de cinco'
          descripcion: 'a = 5 y b = 1: el máximo de cinco uniformes, cargado hacia 1 con media 5/6.'
          valores: {a: 5, b: 1}
      ejemplo:
        titulo: 'Presa más de la mitad llena'
        contexto: 'El nivel de llenado de una presa, como fracción de su capacidad, sigue una Kumaraswamy con a = 2 y b = 3.'
        pregunta: '¿Qué probabilidad hay de que la presa esté más de la mitad llena?'
        valores: {a: 2, b: 3}
        region: derecha
        desde: 0.5
      referencia:
        distribucion: beta
        valores: {a: 1.8, b: 2.4}
        etiqueta: 'Beta de forma parecida'
        visible: false
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: minimo-de-maximos
        valores:
          a: 2
          b: 3
referencias:
  - clave: murphy
publicado: true
---

## Intuición

Muchas cantidades viven entre 0 y 1: el nivel de llenado de una presa, la fracción de humedad del suelo o la proporción de capacidad usada de un servidor. La distribución beta es el modelo clásico para ellas, pero su función de distribución no tiene fórmula elemental, lo que complica calcular cuantiles o simular. La distribución de Kumaraswamy, propuesta por el hidrólogo Ponnambalam Kumaraswamy, ofrece formas muy parecidas a las de la beta con una función de distribución que se escribe en una línea.

Con parámetros enteros tiene una interpretación concreta. El máximo de $a$ números uniformes tiene función de distribución $x^{a}$. Si se forman $b$ grupos así y se toma el menor de los $b$ máximos, la función de distribución resultante es $1 - (1 - x^{a})^{b}$. El parámetro $a$ empuja la masa hacia el 1 y el parámetro $b$ hacia el 0, igual que los dos parámetros de la beta.

Como su cuantil también es explícito, $\left[1 - (1 - p)^{1/b}\right]^{1/a}$, simular una Kumaraswamy es inmediato con una uniforme, una ventaja práctica en modelos que deben generar proporciones muchas veces.

## Definición

:::definicion[Distribución de Kumaraswamy]
Una variable $X$ en $[0, 1]$ tiene **distribución de Kumaraswamy** con parámetros $a, b > 0$ si
$$
F(x) = 1 - (1 - x^{a})^{b}, \qquad f(x) = ab\,x^{a - 1}(1 - x^{a})^{b - 1}, \qquad 0 \le x \le 1.
$$
:::

:::teorema[Mínimo de máximos]
Si $a$ y $b$ son enteros y $U_{g,i}$, $g = 1, \dots, b$, $i = 1, \dots, a$, son uniformes en $(0, 1)$ independientes, entonces $\min_{g}\max_{i} U_{g,i}$ tiene distribución de Kumaraswamy con parámetros $a$ y $b$.
:::

:::nota[Qué significa cada símbolo]
- $X$: proporción entre 0 y 1.
- $a$: parámetro que empuja la masa hacia 1.
- $b$: parámetro que empuja la masa hacia 0.
- $F(x)$, $f(x)$: función de distribución y densidad.
- $U_{g,i}$: uniforme $i$ del grupo $g$.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad de Kumaraswamy, la región elegida y su probabilidad; los casos cargan la uniforme, el llenado de una presa y el máximo de cinco, y el ejemplo de la ficha se carga con su botón; la comparación superpone una beta de forma parecida. La pestaña Ver cómo surge forma $b$ grupos de $a$ uniformes, marca el máximo de cada grupo y registra el menor de esos máximos.

Al subir $a$ la masa se desplaza a la derecha; al subir $b$, a la izquierda. Con la comparación activada se ve qué tan cerca está de una beta con media y varianza similares.

## Ejemplo

El nivel de llenado de una presa sigue una Kumaraswamy con $a = 2$ y $b = 3$.

1. Probabilidad de que esté más de la mitad llena: $P(X > 0.5) = (1 - 0.5^{2})^{3} = 0.75^{3} \approx 0.422$.
2. Mediana: $\left[1 - 0.5^{1/3}\right]^{1/2} \approx 0.454$.
3. Media: $b\,B(1 + 1/a, b) \approx 0.457$.
4. Nivel que se supera solo el 10 % del tiempo: $\left[1 - 0.1^{1/3}\right]^{1/2} \approx 0.733$.

:::figura[Presa más de la mitad llena: el área sombreada a la derecha de 0.5 vale 0.422. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: kumaraswamy
valores:
  a: 2
  b: 3
ejemplo:
  titulo: 'Presa más de la mitad llena'
  contexto: 'El nivel de llenado de una presa, como fracción de su capacidad, sigue una Kumaraswamy con a = 2 y b = 3.'
  pregunta: '¿Qué probabilidad hay de que la presa esté más de la mitad llena?'
  valores: {a: 2, b: 3}
  region: derecha
  desde: 0.5
region: derecha
desde: 0.5
probabilidad: 0.9
muestras: false
```
:::

## Propiedades

- **Cuantil explícito:** $F^{-1}(p) = \left[1 - (1 - p)^{1/b}\right]^{1/a}$.
- **Momentos:** $\mathbb{E}[X^{n}] = b\,B(1 + n/a, b)$.
- **Casos particulares:** $a = b = 1$ es la uniforme; $b = 1$ da $F(x) = x^{a}$, el máximo de $a$ uniformes; $a = 1$ da el mínimo de $b$ uniformes.
- **Relación con la beta:** si $X$ es Kumaraswamy, $X^{a} \sim \operatorname{Beta}(1, b)$.
- **Simulación:** $X = \left[1 - U^{1/b}\right]^{1/a}$ con $U$ uniforme.

:::figura[Tres casos con contexto (uniforme, llenado de una presa y máximo de cinco): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: kumaraswamy
valores:
  a: 2
  b: 3
casos:
  - nombre: 'Uniforme'
    descripcion: 'a = b = 1: densidad plana.'
    valores: {a: 1, b: 1}
  - nombre: 'Llenado de una presa'
    descripcion: 'a = 2 y b = 3: masa en la mitad baja.'
    valores: {a: 2, b: 3}
  - nombre: 'Máximo de cinco'
    descripcion: 'a = 5 y b = 1: cargada hacia 1.'
    valores: {a: 5, b: 1}
muestras: false
```
:::

:::figura[Mínimo de máximos: tres grupos de dos uniformes; el máximo de cada grupo se marca y el menor de ellos es el resultado.]{componente="ContinuousGenesis"}
```yaml
proceso: minimo-de-maximos
valores:
  a: 2
  b: 3
```
:::

## Errores comunes

- **Tratar a y b como los parámetros de una beta.** Kumaraswamy$(a, b)$ y Beta$(a, b)$ tienen formas parecidas pero no iguales; la media y la varianza difieren.
- **Usarla fuera de [0, 1] sin reescalar.** Para otros intervalos hay que transformar la variable.
- **Esperar una conjugación como la de la beta.** La beta es conjugada de la binomial; la Kumaraswamy no lo es.
- **Confundir los papeles de a y b.** $a$ empuja hacia 1 y $b$ hacia 0, al revés de lo que podría sugerir el orden.

:::figura[Kumaraswamy(2, 3) (curva) frente a Beta(2, 3) (línea punteada): parecidas, pero no iguales; la beta tiene media 0.4 y la Kumaraswamy 0.457.]{componente="DistributionExplorer"}
```yaml
distribucion: kumaraswamy
valores:
  a: 2
  b: 3
muestras: false
referencia:
  distribucion: beta
  valores:
    a: 2
    b: 3
  etiqueta: Beta(2, 3)
```
:::

## Conexiones

La Kumaraswamy es una alternativa a la [[distribucion-beta]] con función de distribución explícita. Con parámetros enteros se construye con máximos y mínimos de la [[distribucion-uniforme-continua]], y con $b = 1$ es el estadístico de orden más alto, una beta. Se usa en hidrología y en modelos de aprendizaje automático que necesitan simular proporciones con reparametrizaciones simples.

## Formulario

:::formula[Distribución y densidad]
$$
F(x) = 1 - (1 - x^{a})^{b}, \qquad f(x) = ab\,x^{a - 1}(1 - x^{a})^{b - 1}
$$

- $a$, $b$: parámetros de forma positivos.
:::

:::formula[Cuantil y simulación]
$$
F^{-1}(p) = \left[1 - (1 - p)^{1/b}\right]^{1/a}
$$

- $p$: probabilidad acumulada.
:::

:::formula[Momentos]
$$
\mathbb{E}[X^{n}] = b\,B\!\left(1 + \frac{n}{a},\ b\right)
$$

- $B$: función beta.
:::

:::formula[Mínimo de máximos]
$$
X = \min_{g = 1, \dots, b}\ \max_{i = 1, \dots, a} U_{g,i}
$$

- $U_{g,i}$: uniformes independientes; $a$, $b$ enteros.
:::
