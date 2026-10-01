---
id: distribucion-binomial
titulo: Distribución binomial
titulo_en: Binomial distribution
alias:
  - binomial
  - número de éxitos en n ensayos
  - Bin(n, p)
modulo: 2
submodulo: '2.1'
orden: 3
nivel: basico
prerrequisitos:
  - distribucion-de-bernoulli
  - coeficiente-binomial
relaciones:
  - tipo: relacionado
    id: teorema-del-binomio
etiquetas:
  - distribución discreta
  - conteo de éxitos
  - ensayos independientes
  - control de calidad
resumen: >
  Cuenta los éxitos en n ensayos de Bernoulli independientes con la misma probabilidad p. Su función de
  masa multiplica el número de órdenes posibles por la probabilidad de cada orden.
formula: 'P(X = k) = \binom{n}{k} p^{k} (1 - p)^{n - k}, \quad k = 0, 1, \dots, n'
visualizacion:
  componente: DistributionGenesis
  parametros:
    proceso: ensayos
    valores:
      n: 12
      p: 0.1
    exito: Defectuosa
    fracaso: Correcta
referencias:
  - clave: blitzstein-hwang
    capitulo: '3'
  - clave: ross-probabilidad
    capitulo: '4'
publicado: true
---

## Intuición

Una línea de producción fabrica piezas y cada una sale defectuosa con probabilidad 0.1, sin que una pieza afecte a las demás. Un inspector toma una caja con 12 piezas y cuenta cuántas defectuosas hay. Puede haber ninguna, una, dos o, con muy poca probabilidad, las doce. La distribución binomial dice qué tan probable es cada uno de esos conteos.

El razonamiento tiene dos partes. Primero, cualquier secuencia concreta con dos defectuosas y diez correctas tiene la misma probabilidad: dos factores de 0.1 y diez factores de 0.9, porque las piezas son independientes. Segundo, hay muchas secuencias distintas con exactamente dos defectuosas, tantas como formas de elegir qué dos posiciones lo son. La probabilidad del conteo es el número de secuencias por la probabilidad de cada una.

Así, la binomial no depende del orden en que aparecen los éxitos, solo de cuántos hubo. Sus dos parámetros, el número de ensayos y la probabilidad de éxito, controlan dónde se concentra el conteo y qué tanto varía. Con muchos ensayos su forma se vuelve una campana.

## Definición

:::definicion[Distribución binomial]
Sean $X_1, \dots, X_n$ variables independientes con $X_i \sim \operatorname{Bernoulli}(p)$. El número de éxitos $X = X_1 + \dots + X_n$ tiene **distribución binomial** con parámetros $n \in \mathbb{N}$ y $p \in [0, 1]$, y se escribe $X \sim \operatorname{Bin}(n, p)$. Su función de masa es
$$
P(X = k) = \binom{n}{k} p^{k} (1 - p)^{n - k}, \qquad k = 0, 1, \dots, n.
$$
:::

Supuestos: número de ensayos $n$ fijo de antemano, dos resultados por ensayo, ensayos independientes y la misma probabilidad de éxito $p$ en todos.

:::nota[Qué significa cada símbolo]
- $X$: número de éxitos en los $n$ ensayos.
- $X_i$: resultado del ensayo $i$, 1 si es éxito y 0 si no.
- $n$: número de ensayos, fijo.
- $p$: probabilidad de éxito en cada ensayo.
- $k$: número de éxitos cuya probabilidad se calcula.
- $\binom{n}{k}$: número de maneras de elegir qué $k$ ensayos son éxitos.
- $p^{k}(1 - p)^{n - k}$: probabilidad de una secuencia concreta con $k$ éxitos y $n - k$ fracasos.
:::

## Cómo usar la visualización

Cada experimento revisa una caja de $n$ piezas: las fichas aparecen una por una, rellenas si la pieza es defectuosa. Al terminar la caja, su número de defectuosas cae en el histograma, que se compara con la función de masa binomial (puntos). El encabezado muestra el conteo en curso y, al terminar, la fórmula con los números de ese conteo.

Con $p = 0.1$ y $n = 12$ el histograma se concentra en 0, 1 y 2 y tiene cola a la derecha. Al subir $p$ a 0.5 la forma se vuelve simétrica alrededor de $n/2$. Al aumentar $n$ hasta 40 con $p = 0.5$ la forma se parece a una campana, y la varianza de los resultados se acerca a $np(1 - p)$.

## Ejemplo

Un medicamento mejora los síntomas en el 70 % de los pacientes. En un ensayo con 8 pacientes que responden de manera independiente, sea $X$ el número que mejora, $X \sim \operatorname{Bin}(8, 0.7)$.

1. Exactamente 6 mejoran: $P(X = 6) = \binom{8}{6}(0.7)^{6}(0.3)^{2} = 28 \cdot 0.117649 \cdot 0.09 \approx 0.2965$.
2. Exactamente 7: $P(X = 7) = 8 \cdot (0.7)^{7}(0.3) \approx 0.1977$; los 8: $P(X = 8) = (0.7)^{8} \approx 0.0576$.
3. Al menos 6 mejoran: $P(X \ge 6) \approx 0.2965 + 0.1977 + 0.0576 = 0.5518$.
4. Número esperado de pacientes que mejoran: $\mathbb{E}[X] = 8 \cdot 0.7 = 5.6$, con varianza $8 \cdot 0.7 \cdot 0.3 = 1.68$.

:::figura[Bin(8, 0.7): el intervalo sombreado de 6 a 8 acumula 0.5518. La masa se carga hacia la derecha porque p es mayor que 1/2.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 8
  p: 0.7
desde: 6
hasta: 8
muestras: false
```
:::

:::figura[El ensayo con 8 pacientes repetido muchas veces. Cada grupo de fichas es un ensayo; el conteo de pacientes que mejoran se acumula y reproduce la función de masa.]{componente="DistributionGenesis"}
```yaml
proceso: ensayos
valores:
  n: 8
  p: 0.7
exito: Mejora
fracaso: Sin mejora
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[X] = np$ y $\operatorname{Var}(X) = np(1 - p)$, por ser suma de $n$ Bernoulli independientes.
- **Forma:** simétrica si $p = 1/2$; con cola a la derecha si $p < 1/2$ y a la izquierda si $p > 1/2$.
- **Moda:** el valor más probable es $\lfloor (n + 1)p \rfloor$ (si $(n+1)p$ es entero, también lo es $(n + 1)p - 1$).
- **Reflexión:** el número de fracasos $n - X$ tiene distribución $\operatorname{Bin}(n, 1 - p)$.
- **Suma:** si $X \sim \operatorname{Bin}(n_1, p)$ y $Y \sim \operatorname{Bin}(n_2, p)$ son independientes, $X + Y \sim \operatorname{Bin}(n_1 + n_2, p)$.
- **Aproximación normal:** si $np(1 - p)$ es grande, la binomial se parece a $\mathcal{N}(np, np(1 - p))$.

:::figura[Con p = 1/2 la binomial es simétrica: Bin(20, 0.5) tiene su moda y su media en 10.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 20
  p: 0.5
muestras: false
```
:::

:::figura[Con p pequeña la forma es asimétrica: Bin(20, 0.1) concentra la masa en 1 y 2 y tiene cola larga a la derecha. La moda es el entero de (20 + 1)(0.1) = 2.1, es decir 2.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 20
  p: 0.1
muestras: false
```
:::

:::figura[Bin(16, 0.25) frente a la normal de media 4 y desviación 1.73 (línea punteada). Aun con n moderado la campana sigue de cerca a las barras.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 16
  p: 0.25
muestras: false
referencia:
  distribucion: normal
  valores:
    mu: 4
    sigma: 1.732
  etiqueta: Normal de media 4 y desviación 1.73
```
:::

:::demostracion
Media y varianza: $X = \sum_{i=1}^{n} X_i$ con $X_i \sim \operatorname{Bernoulli}(p)$ independientes. Por linealidad, $\mathbb{E}[X] = \sum_{i} \mathbb{E}[X_i] = np$. Por independencia, las varianzas se suman: $\operatorname{Var}(X) = \sum_{i} \operatorname{Var}(X_i) = np(1 - p)$. Que las probabilidades suman 1 se sigue del teorema del binomio: $\sum_{k=0}^{n} \binom{n}{k} p^{k}(1-p)^{n-k} = (p + 1 - p)^{n} = 1$.
:::

## Errores comunes

- **Olvidar el coeficiente binomial.** $p^{k}(1 - p)^{n - k}$ es la probabilidad de una secuencia concreta; hay $\binom{n}{k}$ secuencias con $k$ éxitos. Con 4 lanzamientos de una moneda justa, $P(X = 2) = 6/16$, no $1/16$.
- **Usarla sin independencia o sin p constante.** Al extraer sin reemplazo de un lote pequeño, la probabilidad cambia de una extracción a otra y el modelo correcto es la hipergeométrica.
- **Confundir "al menos k" con "más de k".** $P(X \ge 7) = P(X = 7) + P(X = 8)$, mientras que $P(X > 7) = P(X = 8)$.
- **Aplicarla cuando el número de ensayos no está fijo.** Si se ensaya hasta lograr un éxito, lo aleatorio es el número de ensayos y la distribución es geométrica o binomial negativa.

:::figura[Cuatro lanzamientos de una moneda justa: el encabezado muestra el coeficiente binomial 6 para dos caras. Hay seis órdenes con dos caras y cada uno tiene probabilidad 1/16.]{componente="DistributionGenesis"}
```yaml
proceso: ensayos
valores:
  n: 4
  p: 0.5
exito: Cara
fracaso: Cruz
```
:::

:::figura[Sin reemplazo la binomial falla: en una urna de 20 bolas con 8 marcadas, la hipergeométrica (puntos) es más concentrada que la binomial con p = 0.4 (línea punteada).]{componente="DistributionGenesis"}
```yaml
proceso: urna
valores:
  N: 20
  K: 8
  n: 10
comparar: true
```
:::

:::figura[Al menos 7 de 8 pacientes: se sombrean las barras de 7 y 8, que suman 0.2553. Más de 7 sería solo la barra del 8.]{componente="DistributionExplorer"}
```yaml
distribucion: binomial
valores:
  n: 8
  p: 0.7
desde: 7
hasta: 8
muestras: false
```
:::

## Conexiones

La binomial es la suma de ensayos de la [[distribucion-de-bernoulli]], y su función de masa usa el [[coeficiente-binomial]]; que sume uno es el [[teorema-del-binomio]]. Si se cuenta el número de ensayos necesario en lugar de fijarlo, aparecen la [[distribucion-geometrica]] y la [[distribucion-binomial-negativa]]. Sin reemplazo en una población finita se convierte en la [[distribucion-hipergeometrica]]. Con $n$ grande y $p$ pequeña se aproxima por la [[distribucion-de-poisson]]. Con más de dos resultados por ensayo se generaliza a la [[distribucion-multinomial]], y si $p$ varía según una distribución beta, a la [[distribucion-beta-binomial]].

## Formulario

:::formula[Función de masa]
$$
P(X = k) = \binom{n}{k} p^{k} (1 - p)^{n - k}
$$

- $X$: número de éxitos.
- $n$: número de ensayos.
- $p$: probabilidad de éxito por ensayo.
- $k$: número de éxitos, entre 0 y $n$.
- $\binom{n}{k}$: número de secuencias con $k$ éxitos.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = np, \qquad \operatorname{Var}(X) = np(1 - p)
$$

- $np$: número esperado de éxitos.
- $np(1 - p)$: varianza del conteo.
:::

:::formula[Moda]
$$
\operatorname{moda}(X) = \lfloor (n + 1)p \rfloor
$$

- $\lfloor \cdot \rfloor$: parte entera.
- Si $(n + 1)p$ es entero, hay dos modas: $(n + 1)p$ y $(n + 1)p - 1$.
:::

:::formula[Suma de binomiales con la misma p]
$$
X \sim \operatorname{Bin}(n_1, p),\ Y \sim \operatorname{Bin}(n_2, p) \text{ independientes} \implies X + Y \sim \operatorname{Bin}(n_1 + n_2, p)
$$

- $n_1$, $n_2$: ensayos de cada grupo.
- La probabilidad $p$ debe ser la misma en ambos.
:::

:::formula[Aproximación normal]
$$
X \approx \mathcal{N}\big(np,\ np(1 - p)\big) \quad \text{si } np(1 - p) \text{ es grande}
$$

- $\mathcal{N}(\mu, \sigma^2)$: normal con media $\mu$ y varianza $\sigma^2$.
- Regla práctica: $np(1 - p) \ge 10$.
:::
