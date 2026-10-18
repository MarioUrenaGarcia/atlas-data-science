---
id: medida-de-lebesgue
titulo: Medida de Lebesgue
titulo_en: Lebesgue measure
alias:
  - longitud de Lebesgue
  - medida exterior de Lebesgue
  - λ
modulo: 0
submodulo: '0.9'
orden: 4
nivel: avanzado
prerrequisitos:
  - medida-y-espacio-de-medida
  - supremo-e-infimo
etiquetas:
  - teoría de la medida
  - longitud
  - cubrimientos
  - medida exterior
resumen: >
  La medida de Lebesgue extiende la longitud de los intervalos a una sigma-álgebra muy amplia de
  subconjuntos de la recta. Se define como el ínfimo de las longitudes totales de cubrimientos por intervalos.
formula: '\lambda^*(A) = \inf\Big\{\sum_{k} (b_k - a_k) : A \subseteq \bigcup_{k} (a_k, b_k)\Big\}, \qquad \lambda([a, b]) = b - a'
visualizacion:
  componente: MeasureLab
  parametros:
    modo: cubrimiento
    epsilon: 0.5
    cantidad: 30
referencias:
  - clave: durrett
publicado: true
---

## Intuición

Medir la longitud de un intervalo es inmediato, pero la recta tiene subconjuntos mucho más complicados: el conjunto de los racionales, el conjunto de Cantor, uniones infinitas de intervalos. Lebesgue propuso medirlos por fuera: cubrir el conjunto con intervalos, sumar sus longitudes y buscar el cubrimiento más económico. El ínfimo de esas sumas es la medida exterior del conjunto.

Para un intervalo, el mejor cubrimiento es el propio intervalo y la medida coincide con la longitud. Para los racionales de $[0, 1]$, en cambio, se puede poner al racional número $k$ dentro de un intervalo de longitud $\varepsilon/2^k$: todos quedan cubiertos con longitud total menor que $\varepsilon$, por pequeño que sea $\varepsilon$, y su medida es cero aunque estén en todas partes.

Restringida a los conjuntos medibles, que incluyen los abiertos, los cerrados y todo lo que se construye con ellos mediante operaciones numerables, la medida exterior es una verdadera medida: la medida de Lebesgue.

## Definición

:::definicion[Medida de Lebesgue]
La medida exterior de Lebesgue de $A \subseteq \mathbb{R}$ es
$$
\lambda^*(A) = \inf\Big\{\sum_{k=1}^{\infty}(b_k - a_k) : A \subseteq \bigcup_{k=1}^{\infty}(a_k, b_k)\Big\}.
$$
Un conjunto $E$ es medible según Carathéodory si $\lambda^*(B) = \lambda^*(B \cap E) + \lambda^*(B \cap E^c)$ para todo $B \subseteq \mathbb{R}$. Los conjuntos medibles forman una sigma-álgebra $\mathcal{L}$ que contiene a los borelianos, y $\lambda = \lambda^*|_{\mathcal{L}}$ es la medida de Lebesgue.
:::

En $\mathbb{R}^d$ se usan rectángulos en lugar de intervalos, y la medida de un rectángulo es el producto de las longitudes de sus lados.

:::nota[Qué significa cada símbolo]
- $A$, $B$, $E$: subconjuntos de $\mathbb{R}$.
- $\lambda^*$: medida exterior; $\lambda$: medida de Lebesgue.
- $(a_k, b_k)$: intervalos abiertos del cubrimiento; $b_k - a_k$: su longitud.
- $\inf$: ínfimo, la mayor cota inferior.
- $E^c$: complemento de $E$.
- $\mathcal{L}$: sigma-álgebra de los conjuntos medibles de Lebesgue.
- $\lambda^*|_{\mathcal{L}}$: restricción de $\lambda^*$ a esos conjuntos.
- $d$: dimensión.
:::

## Cómo usar la visualización

Los puntos son los racionales de $[0, 1]$ en el orden 0, 1, 1/2, 1/3, 2/3, 1/4, ...; cada uno se cubre con un intervalo, repartidos en seis renglones para que se vean los traslapes. El racional número $k$ recibe un intervalo de longitud $\varepsilon/2^k$. El control fija $\varepsilon$; la reproducción agrega un racional por paso.

Con $\varepsilon = 0.5$ el primer intervalo mide 0.25, el segundo 0.125, y desde el décimo los intervalos ya no se distinguen. Tras 30 racionales, el último es 1/10 y su intervalo mide $4.7 \times 10^{-10}$; la suma de longitudes es $0.5(1 - 2^{-30})$, prácticamente 0.5 y nunca mayor.

## Ejemplo

Se calcula la medida de $A = [0, 1] \cap \mathbb{Q}$.

1. Los racionales de $[0, 1]$ son numerables: $q_1, q_2, \dots$
2. Para $\varepsilon > 0$, se cubre $q_k$ con un intervalo de longitud $\varepsilon/2^k$.
3. La suma de longitudes es $\sum_k \varepsilon/2^k = \varepsilon$.
4. Así $\lambda^*(A) \le \varepsilon$ para todo $\varepsilon > 0$, de modo que $\lambda(A) = 0$.
5. En consecuencia, los irracionales de $[0, 1]$ miden $1 - 0 = 1$.

:::figura[Cubrimiento con $\varepsilon = 0.1$: los treinta primeros racionales quedan cubiertos con longitud total 0.1, y el intervalo del décimo mide menos de $10^{-4}$.]{componente="MeasureLab"}
```yaml
modo: cubrimiento
epsilon: 0.1
cantidad: 30
```
:::

## Propiedades

- **Intervalos:** $\lambda([a, b]) = \lambda((a, b)) = b - a$; los puntos miden cero.
- **Invariancia por traslación:** $\lambda(A + c) = \lambda(A)$.
- **Escala:** $\lambda(cA) = |c|\,\lambda(A)$.
- **Regularidad:** $\lambda(A) = \inf\{\lambda(U) : U \supseteq A \text{ abierto}\} = \sup\{\lambda(K) : K \subseteq A \text{ compacto}\}$.
- **Conjuntos numerables:** todo conjunto numerable mide cero; el recíproco es falso, como muestra el conjunto de Cantor.

:::figura[Conjunto de Cantor: tras 8 niveles quedan 256 intervalos con longitud total 0.039; el límite es un conjunto no numerable de medida cero.]{componente="MeasureLab"}
```yaml
modo: cantor
```
:::

- **Completitud:** todo subconjunto de un conjunto de medida cero es medible y mide cero.

## Errores comunes

- **Pensar que un conjunto denso debe tener medida positiva.** Los racionales están en todo intervalo y miden cero; los diez primeros ya se cubren con longitud 0.4995.

:::figura[Diez racionales con $\varepsilon = 0.5$: cada uno queda dentro de su intervalo, la suma es 0.4995 y el último, 3/5, recibe un intervalo de longitud 0.0005.]{componente="MeasureLab"}
```yaml
modo: cubrimiento
epsilon: 0.5
cantidad: 10
```
:::

- **Creer que todos los subconjuntos de $\mathbb{R}$ son medibles.** Con el axioma de elección se construyen conjuntos no medibles, como el de Vitali.
- **Usar cubrimientos finitos.** Con cubrimientos finitos la medida exterior de los racionales de $[0, 1]$ sería 1; la definición exige cubrimientos numerables.
- **Confundir medida cero con ser vacío o finito.** Medida cero solo dice que el conjunto se cubre con longitud total arbitrariamente pequeña.

## Conexiones

Es la principal [[medida-y-espacio-de-medida|medida]] sobre la recta y se define con el ínfimo de [[supremo-e-infimo]]. Sus conjuntos nulos son los de [[conjuntos-de-medida-cero-y-propiedades-casi-seguras]], la [[integral-de-lebesgue]] respecto de ella extiende la integral de Riemann, y el producto de dos copias da el área de la [[medida-producto-y-teorema-de-fubini]].

## Formulario

:::formula[Medida exterior]
$$
\lambda^*(A) = \inf\Big\{\sum_k (b_k - a_k) : A \subseteq \bigcup_k (a_k, b_k)\Big\}
$$

- $A$: subconjunto de la recta; $(a_k, b_k)$: intervalos de un cubrimiento numerable.
:::

:::formula[Criterio de Carathéodory]
$$
\lambda^*(B) = \lambda^*(B \cap E) + \lambda^*(B \cap E^c) \quad \text{para todo } B
$$

- $E$: conjunto que se declara medible; $B$: conjunto de prueba; $E^c$: complemento.
:::

:::formula[Cubrimiento de un conjunto numerable]
$$
\sum_{k=1}^{\infty}\frac{\varepsilon}{2^{k}} = \varepsilon
$$

- $\varepsilon$: longitud total permitida; $k$: índice del punto cubierto.
:::

:::formula[Traslación y escala]
$$
\lambda(A + c) = \lambda(A), \qquad \lambda(cA) = |c|\,\lambda(A)
$$

- $c$: número real; $A + c$, $cA$: conjunto trasladado y conjunto escalado.
:::
