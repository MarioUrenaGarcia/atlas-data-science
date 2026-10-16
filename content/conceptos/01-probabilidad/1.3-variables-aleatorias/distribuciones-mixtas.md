---
id: distribuciones-mixtas
titulo: Distribuciones mixtas
titulo_en: Mixed distributions
alias:
  - variable aleatoria mixta
  - distribución con átomos
  - distribución semicontinua
modulo: 1
submodulo: '1.3'
orden: 7
nivel: basico
prerrequisitos:
  - funcion-de-distribucion-acumulada
  - funcion-de-densidad-de-probabilidad
relaciones:
  - tipo: contrasta
    id: variables-discretas-vs-continuas
  - tipo: relacionado
    id: distribucion-de-poisson-inflada-en-ceros
etiquetas:
  - masa puntual
  - átomo
  - censura
  - inflación en cero
  - montos de reclamaciones
resumen: >
  Una distribución mixta combina masas puntuales con una parte continua: algunos valores tienen probabilidad positiva y el resto se reparte con una densidad. Su función de distribución tiene saltos y tramos continuos.
formula: 'F(x) = \sum_{x_i \le x} p_i + w \int_{-\infty}^{x} f_c(t)\,dt, \qquad \sum_i p_i + w = 1'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: mixta
    distribucion: gamma
    parametros:
      alpha: 2
      beta: 1
    atomos:
      - x: 0
        p: 0.7
    x: 1
    contexto: Monto anual reclamado por una póliza, en miles de pesos. El 70 % de las pólizas no reclama nada.
referencias:
  - clave: blitzstein-hwang
    capitulo: '5.1'
  - clave: degroot
    capitulo: '3.3'
publicado: true
---

## Intuición

Muchas cantidades reales no son puramente discretas ni puramente continuas. La lluvia de un día es exactamente 0 en los días secos, que son frecuentes, y cualquier cantidad positiva en los días con lluvia. El monto que una aseguradora paga por una póliza en un año es 0 para la mayoría y una cantidad continua para quienes reclaman. El tiempo de espera en un semáforo es 0 si la luz está en verde y cualquier valor entre 0 y la duración del rojo si no.

En todos estos casos hay **átomos**, valores que se llevan una probabilidad positiva, y además una parte que se reparte como una densidad. Ni la función de masa ni la densidad sirven solas, pero la función de distribución describe la mezcla sin problema: salta en los átomos y crece continuamente en el resto.

## Definición

:::definicion[Distribución mixta]
Una variable aleatoria $X$ tiene una **distribución mixta** si existen valores $x_1, x_2, \dots$ con probabilidades $p_i = P(X = x_i) > 0$, un peso $w \in (0, 1)$ y una densidad $f_c$ tales que $\sum_i p_i + w = 1$ y
$$
F(x) = \sum_{x_i \le x} p_i + w \int_{-\infty}^{x} f_c(t)\,dt.
$$
:::

Dicho de otro modo, $X$ se obtiene así: con probabilidad $1 - w$ se elige uno de los átomos (el átomo $x_i$ con probabilidad $p_i / (1 - w)$), y con probabilidad $w$ se genera un valor de la densidad $f_c$.

:::figura[El tiempo de espera en un semáforo: 40 % de las veces la luz está en verde y la espera es 0; el resto se reparte de manera uniforme entre 0 y 2 minutos. La función de distribución salta 0.4 en el 0 y luego sube en línea recta.]{componente="RandomVariableLab"}
```yaml
modo: mixta
distribucion: uniforme
parametros:
  a: 0
  b: 2
atomos:
  - x: 0
    p: 0.4
x: 1
```
:::

:::nota[Qué significa cada símbolo]
- $x_i$: átomos, valores con probabilidad positiva.
- $p_i = P(X = x_i)$: probabilidad de cada átomo.
- $w$: peso de la parte continua.
- $f_c$: densidad de la parte continua, con área total 1.
- $F(x)$: función de distribución de la mezcla.
- $W$: tiempo de espera del ejemplo, en minutos.
:::

## Cómo usar la visualización

La gráfica de arriba muestra el monto reclamado por una póliza: una espiga en el 0, con la probabilidad 0.7 escrita a su lado, y la densidad de los montos positivos multiplicada por su peso 0.3. La espiga no comparte escala con la densidad: su altura solo ordena los átomos y el valor real está en la etiqueta.

Abajo está la función de distribución. Al mover el punto $x$, el encabezado separa lo acumulado en saltos de lo acumulado por la parte continua. En el 0 la curva salta de 0 a 0.7; después sube suavemente hacia 1.

## Ejemplo

En el semáforo, la espera $W$ vale 0 con probabilidad 0.4 y, con probabilidad 0.6, es uniforme entre 0 y 2 minutos.

1. $P(W = 0) = 0.4$, el tamaño del salto en 0.
2. $P(W \le 0.5) = 0.4 + 0.6 \cdot \tfrac{0.5}{2} = 0.4 + 0.15 = 0.55$.
3. $P(0.5 < W \le 1.5) = 0.6 \cdot \tfrac{1}{2} = 0.3$: entre 0.5 y 1.5 no hay átomos, solo parte continua.
4. Espera media: $\mathbb{E}[W] = 0.4 \cdot 0 + 0.6 \cdot 1 = 0.6$ minutos, donde 1 es la media de la uniforme entre 0 y 2.

:::figura[El ejemplo del semáforo en $x = 0.5$: la función de distribución vale 0.55, la suma del salto de 0.4 y del área 0.15 de la parte continua.]{componente="RandomVariableLab"}
```yaml
modo: mixta
distribucion: uniforme
parametros:
  a: 0
  b: 2
atomos:
  - x: 0
    p: 0.4
x: 0.5
```
:::

## Propiedades

- **Descomposición:** toda función de distribución de interés práctico se escribe como una parte de saltos más una parte continua; las discretas y las continuas son los casos extremos $w = 0$ y $w = 1$.
- **Esperanza:** $\mathbb{E}[X] = \sum_i p_i x_i + w \int x f_c(x)\,dx$, una suma sobre los átomos más una integral sobre la parte continua.
- **Saltos:** $P(X = x_i) = p_i$ es el salto de $F$ en $x_i$, y fuera de los átomos $F$ es continua.
- **Censura:** si una cantidad continua se registra con un tope, como un sensor que no mide más allá de cierto valor, toda la probabilidad por encima del tope se acumula en un átomo.

:::figura[Dos átomos y una parte continua: el nivel de una presa vale 0 (vacía) con probabilidad 0.2, 5 metros (llena) con probabilidad 0.1, y se reparte de manera uniforme entre 0 y 5 el resto del tiempo.]{componente="RandomVariableLab"}
```yaml
modo: mixta
distribucion: uniforme
parametros:
  a: 0
  b: 5
atomos:
  - x: 0
    p: 0.2
  - x: 5
    p: 0.1
x: 2.5
```
:::

## Errores comunes

- **Ajustar una densidad a datos con muchos ceros.** Una densidad continua da probabilidad 0 al valor 0 exacto, y el modelo no puede reproducir la proporción de ceros observada.
- **Calcular la media solo con la parte continua.** Hay que ponderar por $w$ y sumar la contribución de los átomos.
- **Llamar mixta a una distribución discreta inflada en cero.** La Poisson inflada en ceros mezcla dos distribuciones discretas; el resultado sigue siendo discreto.

:::figura[La lluvia diaria en milímetros: el 60 % de los días son secos, y en los demás la lluvia es exponencial con media 2. La media es $0.4 \cdot 2 = 0.8$ milímetros, no 2.]{componente="RandomVariableLab"}
```yaml
modo: mixta
distribucion: exponencial
parametros:
  lambda: 0.5
atomos:
  - x: 0
    p: 0.6
x: 2
```
:::

## Conexiones

Las distribuciones mixtas quedan fuera de la división de [[variables-discretas-vs-continuas]] y solo se describen bien con la [[funcion-de-distribucion-acumulada]]: sus átomos se manejan como una [[funcion-de-masa-de-probabilidad]] y su parte continua como una [[funcion-de-densidad-de-probabilidad]]. La [[esperanza-matematica]] combina una suma y una integral. La [[distribucion-de-poisson-inflada-en-ceros]] resuelve un problema parecido, el exceso de ceros, pero dentro de las distribuciones discretas.

## Formulario

:::formula[Función de distribución mixta]
$$
F(x) = \sum_{x_i \le x} p_i + w \int_{-\infty}^{x} f_c(t)\,dt, \qquad \sum_i p_i + w = 1
$$

- $p_i$: masas de los átomos; $w$: peso de la parte continua.
:::

:::formula[Esperanza]
$$
\mathbb{E}[X] = \sum_i p_i x_i + w \int_{-\infty}^{\infty} x f_c(x)\,dx
$$

- Suma sobre los átomos más integral sobre la densidad.
:::

:::formula[Masa de un átomo]
$$
P(X = x_i) = F(x_i) - F(x_i^-) = p_i
$$

- Es el salto de $F$ en el átomo.
:::
