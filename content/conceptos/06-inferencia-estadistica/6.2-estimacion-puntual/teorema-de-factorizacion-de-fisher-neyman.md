---
id: teorema-de-factorizacion-de-fisher-neyman
titulo: Teorema de factorización de Fisher-Neyman
titulo_en: Fisher-Neyman factorization theorem
alias:
  - criterio de factorización
  - factorización de la verosimilitud
modulo: 6
submodulo: '6.2'
orden: 10
nivel: intermedio
prerrequisitos:
  - suficiencia
etiquetas:
  - inferencia
  - suficiencia
  - verosimilitud
  - factorización
resumen: >
  Un estadístico T es suficiente si y solo si la densidad conjunta de la muestra se escribe como un factor
  que depende del parámetro solo a través de T, por otro que no depende del parámetro.
formula: 'f_\theta(\mathbf{x}) = g\big(T(\mathbf{x}), \theta\big)\,h(\mathbf{x})'
visualizacion:
  componente: SufficiencyLab
  parametros:
    modo: factorizacion
    muestras: [[3, 5, 7], [1, 5, 9], [4, 5, 6], [6, 7, 8]]
    sigma: 2
referencias:
  - clave: casella-berger
    capitulo: '6'
publicado: true
---

## Intuición

Comprobar la suficiencia con la definición exige calcular distribuciones condicionales, lo cual es engorroso. El teorema de factorización ofrece un atajo: basta mirar la fórmula de la densidad conjunta de la muestra. Si se puede separar en dos partes, una que mezcla el parámetro con los datos pero solo a través de un resumen $T$, y otra que depende de los datos pero no del parámetro, entonces ese resumen es suficiente.

En la práctica significa que la **verosimilitud**, vista como función del parámetro, depende de los datos solo a través de $T$. Dos muestras con el mismo $T$ producen verosimilitudes que solo difieren en una constante multiplicativa y, por lo tanto, apuntan exactamente a los mismos valores del parámetro. Para datos normales con desviación conocida, tres muestras distintas con la misma media dan la misma curva de verosimilitud para $\mu$.

## Definición

:::teorema[Teorema de factorización de Fisher-Neyman]
Sea $f_\theta(\mathbf{x})$ la densidad (o función de masa) conjunta de la muestra $\mathbf{X}$. Un estadístico $T(\mathbf{X})$ es suficiente para $\theta$ si y solo si existen funciones $g$ y $h$ no negativas tales que
$$
f_\theta(\mathbf{x}) = g\big(T(\mathbf{x}), \theta\big)\,h(\mathbf{x})
$$
para todo $\mathbf{x}$ y todo $\theta$, donde $h$ no depende de $\theta$.
:::

Ejemplo normal con $\sigma$ conocida: como $\sum (x_i - \mu)^2 = \sum (x_i - \bar{x})^2 + n(\bar{x} - \mu)^2$,
$$
f_\mu(\mathbf{x}) = \underbrace{\exp\!\Big(-\frac{n(\bar{x} - \mu)^2}{2\sigma^2}\Big)}_{g(\bar{x},\,\mu)} \cdot \underbrace{(2\pi\sigma^2)^{-n/2}\exp\!\Big(-\frac{\sum (x_i - \bar{x})^2}{2\sigma^2}\Big)}_{h(\mathbf{x})},
$$
de modo que $\bar{X}$ es suficiente para $\mu$.

:::nota[Qué significa cada símbolo]
- $f_\theta(\mathbf{x})$: densidad conjunta de la muestra cuando el parámetro vale $\theta$.
- $T(\mathbf{x})$: estadístico; $g$: factor que depende de $\theta$ y de los datos solo a través de $T$; $h$: factor que no depende de $\theta$.
- $\mu$, $\sigma$: media y desviación de la normal; $\bar{x}$: media muestral; $n$: tamaño.
:::

## Cómo usar la visualización

Cuatro muestras de 3 datos normales con $\sigma = 2$: las tres primeras tienen media 5 y la cuarta, media 7. Se dibuja la verosimilitud de $\mu$ de cada una, dividida entre su máximo. La línea vertical recorre $\mu$ y el panel compara las verosimilitudes relativas en ese punto.

Experimentos sugeridos:

1. Observar que las tres curvas de media 5 coinciden exactamente, aunque los datos sean distintos (3, 5, 7 contra 1, 5, 9).
2. La cuarta curva, de media 7, está desplazada: cambia el estadístico suficiente, cambia la verosimilitud.
3. En el panel, comparar la verosimilitud relativa de las muestras de media 5 en cualquier $\mu$: es la misma.

## Ejemplo

Muestra de Poisson $x_1, \dots, x_n$ con parámetro $\lambda$:

1. $f_\lambda(\mathbf{x}) = \prod \frac{e^{-\lambda}\lambda^{x_i}}{x_i!} = e^{-n\lambda}\lambda^{\sum x_i} \cdot \frac{1}{\prod x_i!}$.
2. $g(t, \lambda) = e^{-n\lambda}\lambda^{t}$ con $t = \sum x_i$, y $h(\mathbf{x}) = 1/\prod x_i!$.
3. Por el teorema, $T = \sum X_i$ es suficiente para $\lambda$.
4. Las muestras $(2, 0, 4)$ y $(1, 3, 2)$ tienen el mismo total 6: sus verosimilitudes son proporcionales, $e^{-3\lambda}\lambda^6$ por constantes distintas ($1/48$ y $1/12$).

:::figura[Las muestras de Poisson del ejemplo, (2, 0, 4) y (1, 3, 2), con total 6, dan la misma verosimilitud relativa para lambda; la muestra (3, 3, 1), con total 7, da otra curva.]{componente="SufficiencyLab"}
```yaml
modo: factorizacion
modelo: poisson
muestras: [[2, 0, 4], [1, 3, 2], [3, 3, 1]]
```
:::

## Propiedades

- **Si y solo si:** la factorización caracteriza la suficiencia; no es solo una condición suficiente.
- **Lectura directa de la verosimilitud:** como función de $\theta$, $L(\theta) \propto g(T(\mathbf{x}), \theta)$.
- **Familias exponenciales:** si $f_\theta(x) = h(x)\exp\{\eta(\theta)S(x) - A(\theta)\}$, donde $h(x)$ no depende de $\theta$, $\eta(\theta)$ es el parámetro natural, $S(x)$ es una función de los datos y $A(\theta)$ es la constante de normalización en escala logarítmica, entonces $\sum S(X_i)$ es suficiente, porque el producto de las densidades es $\prod h(x_i)\cdot\exp\{\eta(\theta)\sum S(x_i) - nA(\theta)\}$.

:::figura[Mismo total, distinto orden: muestras normales cuyos datos son permutaciones o reacomodos con igual media producen la misma curva.]{componente="SufficiencyLab"}
```yaml
modo: factorizacion
muestras: [[2, 8], [8, 2], [5, 5]]
sigma: 2
```
:::

## Errores comunes

- **Dejar $\theta$ dentro de $h$.** Si el factor que no contiene a $T$ todavía depende del parámetro, la factorización no prueba nada.
- **Olvidar el soporte.** En una uniforme $(0, \theta)$ la densidad incluye la indicadora $\mathbf{1}\{\max x_i \le \theta\}$, que hace suficiente al máximo; omitirla lleva a conclusiones erróneas.
- **Concluir que un estadístico no es suficiente porque no se encontró una factorización.** Hay que probar que no existe, o usar la definición.

:::figura[Uniforme en (0, theta): las tres muestras suman 6.5, pero la verosimilitud depende del máximo por la indicadora del soporte; las dos con máximo 3.5 coinciden y la de máximo 2.5 no.]{componente="SufficiencyLab"}
```yaml
modo: factorizacion
modelo: uniforme
muestras: [[1, 2, 3.5], [2.5, 0.5, 3.5], [2.5, 2.5, 1.5]]
```
:::

## Conexiones

El teorema da un criterio práctico para la [[suficiencia]] y conduce a la [[suficiencia-minima]]. Muestra que la verosimilitud depende de los datos solo a través del estadístico suficiente, la base del [[teorema-de-rao-blackwell]]. La descomposición de sumas de cuadrados del caso normal es una identidad algebraica; la misma descomposición aparece, con sus distribuciones, en el [[teorema-de-cochran]].

## Formulario

:::formula[Factorización]
$$
f_\theta(\mathbf{x}) = g\big(T(\mathbf{x}), \theta\big)\,h(\mathbf{x})
$$

- $g$: depende de $\theta$ y de $\mathbf{x}$ solo por $T$; $h$: no depende de $\theta$.
:::

:::formula[Caso normal con sigma conocida]
$$
f_\mu(\mathbf{x}) \propto \exp\!\Big(-\frac{n(\bar{x} - \mu)^2}{2\sigma^2}\Big)
$$

- $\bar{x}$: media muestral, suficiente para $\mu$; $\sigma$: desviación conocida.
:::

:::formula[Caso Poisson]
$$
f_\lambda(\mathbf{x}) = e^{-n\lambda}\lambda^{\sum x_i}\cdot\frac{1}{\prod x_i!}
$$

- $\lambda$: tasa; $\sum x_i$: suficiente para $\lambda$.
:::

:::formula[Familia exponencial]
$$
f_\theta(x) = h(x)\exp\{\eta(\theta)S(x) - A(\theta)\}\ \Longrightarrow\ \sum_{i=1}^{n} S(X_i)\ \text{es suficiente}
$$

- $h(x)$: factor sin $\theta$; $\eta(\theta)$: parámetro natural; $S(x)$: estadístico de una observación; $A(\theta)$: logaritmo de la constante de normalización.
:::

:::formula[Uniforme en (0, theta)]
$$
f_\theta(\mathbf{x}) = \theta^{-n}\,\mathbf{1}\{x_{(n)} \le \theta\}\,\mathbf{1}\{x_{(1)} \ge 0\}
$$

- $x_{(n)}$: máximo, suficiente para $\theta$; $x_{(1)}$: mínimo; $\mathbf{1}\{\cdot\}$: indicadora; $n$: tamaño.
:::

:::formula[Descomposición de sumas de cuadrados]
$$
\sum_{i=1}^{n}(x_i - \mu)^2 = \sum_{i=1}^{n}(x_i - \bar{x})^2 + n(\bar{x} - \mu)^2
$$

- $x_i$: datos; $\bar{x}$: media muestral; $\mu$: media de la población; $n$: tamaño.
:::
