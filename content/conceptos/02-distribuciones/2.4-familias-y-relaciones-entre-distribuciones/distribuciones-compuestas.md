---
id: distribuciones-compuestas
titulo: Distribuciones compuestas
titulo_en: Compound distributions
alias:
  - Poisson compuesta
  - suma aleatoria
  - modelo colectivo de riesgo
modulo: 2
submodulo: '2.4'
orden: 6
nivel: intermedio
prerrequisitos:
  - mezclas-de-distribuciones
  - distribucion-gamma
relaciones:
  - tipo: relacionado
    id: distribucion-binomial-negativa
etiquetas:
  - suma aleatoria
  - seguros
  - Poisson compuesta
  - riesgo
  - varianza total
resumen: >
  Distribución de una suma con un número aleatorio de sumandos, como el monto total de los reclamos de
  un año. Su media es el número medio de sumandos por la media de cada uno.
formula: 'S = \sum_{i=1}^{N} X_i, \qquad \mathbb{E}[S] = \mathbb{E}[N]\,\mathbb{E}[X], \qquad \operatorname{Var}(S) = \mathbb{E}[N]\operatorname{Var}(X) + \operatorname{Var}(N)\,\mathbb{E}[X]^{2}'
visualizacion:
  componente: FamilyLab
  parametros:
    modo: compuesta
    valores:
      lambda: 3
      media: 2
      forma: 2
    casos:
      - nombre: 'Reclamos de una póliza'
        descripcion: 'Tres reclamos al año en promedio, de 2 mil pesos cada uno: el total tiene media 6 y una masa del 5 % en cero, los años sin reclamos.'
        valores: {lambda: 3, media: 2, forma: 2}
      - nombre: 'Lluvia de una temporada'
        descripcion: 'Quince tormentas con 1 cm de lluvia cada una: con muchos sumandos el total ya se parece a una normal.'
        valores: {lambda: 15, media: 1, forma: 3}
      - nombre: 'Eventos raros y grandes'
        descripcion: 'λ = 0.5 con montos de media 4: más de la mitad de los años el total es cero y, cuando no lo es, puede ser grande.'
        valores: {lambda: 0.5, media: 4, forma: 1}
referencias:
  - clave: ross-procesos
  - clave: blitzstein-hwang
publicado: true
---

## Intuición

Una aseguradora no sabe cuántos reclamos recibirá en el año ni cuánto costará cada uno. El monto total que tendrá que pagar es una suma en la que el número de términos también es aleatorio: un año con pocos reclamos pequeños cuesta poco, uno con muchos reclamos grandes cuesta mucho, y un año sin reclamos no cuesta nada. La distribución de esa suma aleatoria se llama distribución compuesta.

Dos fuentes de incertidumbre se combinan. La primera es cuántos eventos ocurren; la segunda, el tamaño de cada uno. La media del total es intuitiva: el número medio de eventos por el tamaño medio. La varianza tiene dos partes: la que viene de la variabilidad de cada monto y la que viene de no saber cuántos montos habrá.

Cuando el número de eventos es de Poisson se obtiene la Poisson compuesta, el modelo clásico de riesgo en seguros, de la lluvia total en una temporada o del daño total por terremotos. Tiene una particularidad: una masa de probabilidad exactamente en cero, los periodos sin eventos, aunque los montos sean continuos.

## Definición

:::definicion[Distribución compuesta]
Sea $N$ una variable con valores en $\{0, 1, 2, \dots\}$ y sean $X_1, X_2, \dots$ variables independientes e idénticamente distribuidas, independientes de $N$. La suma aleatoria
$$
S = \sum_{i=1}^{N} X_i \qquad (S = 0 \text{ si } N = 0)
$$
tiene **distribución compuesta**. Si $N \sim \operatorname{Poisson}(\lambda)$ se llama **Poisson compuesta**.
:::

:::nota[Qué es X]
$S$ = el total acumulado por un número aleatorio de eventos, como el monto de todos los reclamos de una póliza en un año, en miles de pesos.
:::

:::nota[Qué hace cada parámetro]
- **$\lambda$, número medio de eventos:** cuántos sumandos hay en promedio. Si aumenta, la masa en cero baja como $e^{-\lambda}$ y el total se parece cada vez más a una normal.
- **$m$, monto medio de cada evento:** la escala de cada sumando. Si aumenta, todo el histograma se estira a la derecha.
- **$k$, forma de cada monto:** la variabilidad relativa de cada sumando, con montos gamma. Si aumenta, los montos son más parecidos entre sí y la varianza del total baja.
:::

:::nota[Qué significa cada símbolo]
- $S$: suma aleatoria; $N$: número de sumandos; $X_i$: sumandos independientes e idénticamente distribuidos.
- $\lambda$: media de la Poisson de $N$.
- $\mathbb{E}[X]$, $\operatorname{Var}(X)$, $\mathbb{E}[X^{2}]$: momentos de cada sumando.
- $m$, $k$: media y forma de la gamma de los sumandos; su tasa es $k/m$.
:::

## Cómo usar la visualización

El histograma muestra los totales simulados, la barra separada en cero es la fracción de periodos sin eventos y la curva punteada es la normal con la misma media y varianza. Los controles fijan el número medio de eventos, el monto medio y la forma de cada monto; el panel da la media, la varianza y la probabilidad de total cero, teóricas y simuladas. Los casos cargan reclamos de una póliza, lluvia de una temporada y eventos raros y grandes.

Simula 1000 años con el caso de los reclamos y observa la barra en cero cerca de 0.05. Carga la lluvia y observa que el histograma ya se parece a la normal. Carga los eventos raros y observa que la mayoría de los años cae en la barra del cero.

## Ejemplo

Una póliza recibe en promedio 3 reclamos al año, $N \sim \operatorname{Poisson}(3)$, y cada reclamo, en miles de pesos, es gamma con forma 2 y media 2, es decir, tasa 1.

1. Momentos de cada reclamo: $\mathbb{E}[X] = 2$, $\operatorname{Var}(X) = 2$ y $\mathbb{E}[X^{2}] = 2 + 4 = 6$.
2. Media del total: $\mathbb{E}[S] = \mathbb{E}[N]\,\mathbb{E}[X] = 3 \cdot 2 = 6$.
3. Varianza del total: para la Poisson compuesta, $\operatorname{Var}(S) = \lambda\,\mathbb{E}[X^{2}] = 3 \cdot 6 = 18$, con desviación 4.24.
4. Descomposición: $\mathbb{E}[N]\operatorname{Var}(X) = 6$ viene de la variabilidad de cada monto y $\operatorname{Var}(N)\mathbb{E}[X]^{2} = 12$ de no saber cuántos reclamos habrá.
5. Probabilidad de un año sin pagos: $P(S = 0) = P(N = 0) = e^{-3} \approx 0.050$.

:::figura[Reclamos de una póliza: el total simulado tiene media 6 y desviación 4.24, con una barra del 5 % en cero que la normal punteada no puede representar.]{componente="FamilyLab"}
```yaml
modo: compuesta
valores:
  lambda: 3
  media: 2
  forma: 2
```
:::

## Propiedades

- **Media:** $\mathbb{E}[S] = \mathbb{E}[N]\,\mathbb{E}[X]$, por la ley de la esperanza total.
- **Varianza:** $\operatorname{Var}(S) = \mathbb{E}[N]\operatorname{Var}(X) + \operatorname{Var}(N)\,\mathbb{E}[X]^{2}$, por la ley de la varianza total; con $N$ de Poisson se reduce a $\lambda\,\mathbb{E}[X^{2}]$.
- **Masa en cero:** $P(S = 0) \ge P(N = 0)$, con igualdad si los sumandos son positivos; en la Poisson compuesta vale $e^{-\lambda}$.
- **Función generadora:** $M_S(t) = M_N(\log M_X(t))$; en la Poisson compuesta, $M_S(t) = \exp\!\big(\lambda(M_X(t) - 1)\big)$.
- **Suma de Poisson compuestas:** la suma de Poisson compuestas independientes es otra Poisson compuesta, con tasa igual a la suma de las tasas.
- **Binomial negativa:** una Poisson compuesta con sumandos de la [[distribucion-logaritmica]] es una binomial negativa.

:::figura[Casos con contexto (reclamos, lluvia, eventos raros): cada botón carga el número medio de eventos y el tamaño de cada uno, y una frase explica la forma del total.]{componente="FamilyLab"}
```yaml
modo: compuesta
valores:
  lambda: 15
  media: 1
  forma: 3
casos:
  - nombre: 'Reclamos de una póliza'
    descripcion: 'λ = 3: media 6 y 5 % en cero.'
    valores: {lambda: 3, media: 2, forma: 2}
  - nombre: 'Lluvia de una temporada'
    descripcion: 'λ = 15: casi normal.'
    valores: {lambda: 15, media: 1, forma: 3}
  - nombre: 'Eventos raros y grandes'
    descripcion: 'λ = 0.5: 61 % de los años en cero.'
    valores: {lambda: 0.5, media: 4, forma: 1}
```
:::

## Errores comunes

- **Calcular la varianza como $\mathbb{E}[N]\operatorname{Var}(X)$.** Falta la parte que viene de la incertidumbre en el número de sumandos, $\operatorname{Var}(N)\mathbb{E}[X]^{2}$, que en el ejemplo es la mayor.
- **Tratar $S$ como $N \cdot X$.** Multiplicar un solo monto por el número de eventos supone montos idénticos y exagera la varianza.
- **Usar una aproximación normal con pocos eventos.** Con $\lambda$ chico, la masa en cero y la asimetría hacen fallar a la normal.
- **Suponer que el número y los montos son independientes sin revisarlo.** En una temporada mala puede haber más reclamos y además más caros; las fórmulas cambian.

:::figura[Pocos eventos, normal inútil: con λ = 0.5 más de la mitad de la probabilidad está en cero y la normal punteada asigna probabilidad a totales negativos.]{componente="FamilyLab"}
```yaml
modo: compuesta
valores:
  lambda: 0.5
  media: 4
  forma: 1
```
:::

## Conexiones

Es una mezcla, como las [[mezclas-de-distribuciones]], pero sobre el número de sumandos. Usa la [[distribucion-de-poisson]] para contar eventos y la [[distribucion-gamma]] para su tamaño; con sumandos de la [[distribucion-logaritmica]] produce la [[distribucion-binomial-negativa]]. Sus momentos salen de las leyes de la esperanza y la varianza totales. En procesos estocásticos, la suma acumulada a lo largo del tiempo es el proceso de Poisson compuesto. El [[mapa-de-relaciones-entre-distribuciones]] reúne estas relaciones.

## Formulario

:::formula[Suma aleatoria]
$$
S = \sum_{i=1}^{N} X_i
$$

- $N$: número aleatorio de sumandos; $X_i$: sumandos independientes de $N$.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[S] = \mathbb{E}[N]\,\mathbb{E}[X], \qquad \operatorname{Var}(S) = \mathbb{E}[N]\operatorname{Var}(X) + \operatorname{Var}(N)\,\mathbb{E}[X]^{2}
$$

- $\mathbb{E}[X]$, $\operatorname{Var}(X)$: momentos de cada sumando.
:::

:::formula[Poisson compuesta]
$$
\operatorname{Var}(S) = \lambda\,\mathbb{E}[X^{2}], \qquad P(S = 0) = e^{-\lambda}
$$

- $\lambda$: tasa de la Poisson; $\mathbb{E}[X^{2}]$: segundo momento de cada sumando.
:::

:::formula[Función generadora de momentos]
$$
M_S(t) = \exp\!\big(\lambda(M_X(t) - 1)\big)
$$

- $M_X$: generadora de cada sumando; $t$: argumento.
:::
