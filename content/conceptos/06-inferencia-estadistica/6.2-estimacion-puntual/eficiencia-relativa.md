---
id: eficiencia-relativa
titulo: Eficiencia relativa
titulo_en: Relative efficiency
alias:
  - eficiencia de un estimador
  - eficiencia asintótica relativa
modulo: 6
submodulo: '6.2'
orden: 7
nivel: intermedio
prerrequisitos:
  - error-cuadratico-medio
etiquetas:
  - inferencia
  - eficiencia
  - comparación de estimadores
  - tamaño de muestra
resumen: >
  La eficiencia relativa de dos estimadores es el cociente de sus errores cuadráticos medios. Se interpreta
  como cuántas veces más datos necesita el menos eficiente para igualar la precisión del otro.
formula: '\operatorname{ef}(\hat{\theta}_1, \hat{\theta}_2) = \frac{\operatorname{ECM}(\hat{\theta}_2)}{\operatorname{ECM}(\hat{\theta}_1)}'
visualizacion:
  componente: EstimatorLab
  parametros:
    modo: comparar
    problema: media-normal
    estimadores: [media, mediana]
    n: 25
    theta: 2
referencias:
  - clave: casella-berger
    capitulo: '10'
  - clave: wasserman
publicado: true
---

## Intuición

Para estimar la presión arterial media de una población se puede usar la media o la mediana de una muestra. Si los datos son normales, las dos están centradas en el valor correcto, pero la mediana oscila más. ¿Cuánto más? Lo suficiente como para que, para lograr la misma precisión que la media con 64 pacientes, la mediana necesite unos 100. Esa razón de tamaños de muestra, 64 entre 100, es la **eficiencia relativa** de la mediana respecto a la media: 0.64.

La eficiencia traduce una comparación técnica de varianzas en algo concreto: datos, tiempo y dinero. Un estimador con eficiencia relativa 0.5 desperdicia la mitad de la información. A cambio, puede tener otras virtudes; la mediana, por ejemplo, resiste los valores atípicos que arruinan a la media.

## Definición

:::definicion[Eficiencia relativa]
La **eficiencia relativa** del estimador $\hat{\theta}_1$ respecto a $\hat{\theta}_2$ es
$$
\operatorname{ef}(\hat{\theta}_1, \hat{\theta}_2) = \frac{\operatorname{ECM}(\hat{\theta}_2)}{\operatorname{ECM}(\hat{\theta}_1)}.
$$
Si es mayor que 1, $\hat{\theta}_1$ es más eficiente. Para estimadores insesgados es el cociente de varianzas. La **eficiencia asintótica relativa** es el límite de este cociente cuando $n \to \infty$.
:::

Cuando la varianza de ambos es proporcional a $1/n$, la eficiencia es el cociente de los tamaños de muestra que dan la misma precisión: si $\operatorname{ef} = 0.64$, el estimador 1 necesita $1/0.64 \approx 1.56$ veces más datos.

:::nota[Qué significa cada símbolo]
- $\hat{\theta}_1$, $\hat{\theta}_2$: dos estimadores del mismo parámetro $\theta$.
- $\operatorname{ECM}$: error cuadrático medio.
- $\operatorname{ef}$: eficiencia relativa.
- $n$: tamaño de la muestra.
:::

## Cómo usar la visualización

La media y la mediana de muestras normales de tamaño 25 se acumulan en dos filas alrededor del valor verdadero. El panel da el error cuadrático medio de cada una; su cociente es la eficiencia relativa.

El control **Tamaño de cada muestra** cambia $n$.

Experimentos sugeridos:

1. Dejar acumular unas 2000 muestras y dividir el ECM de la media entre el de la mediana: se acerca a 0.64.
2. Cambiar $n$ a 100: los dos errores bajan, pero su cociente casi no cambia.
3. Comparar las anchuras de las filas: la de la mediana es cerca de 1.25 veces más ancha, la raíz de $1/0.64$.

## Ejemplo

Estimar el extremo $\theta$ de una uniforme en $(0, \theta)$ con $n = 10$.

1. $\operatorname{Var}(2\bar{X}) = \theta^2/(3n) = \theta^2/30$.
2. $\operatorname{Var}\big(\frac{n+1}{n}X_{(n)}\big) = \theta^2/(n(n+2)) = \theta^2/120$.
3. Ambos son insesgados; la eficiencia del máximo corregido respecto a $2\bar{X}$ es $\frac{\theta^2/30}{\theta^2/120} = 4$.
4. En general es $(n + 2)/3$, que crece sin límite: $2\bar{X}$ necesitaría 4 veces más datos con $n = 10$ y 34 veces más con $n = 100$.

:::figura[Las dos recetas del ejemplo con n igual a 10: el máximo corregido es mucho más angosto.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: maximo-uniforme
estimadores: [momentos, maximo-corregido]
n: 10
theta: 10
```
:::

## Propiedades

- **Media frente a mediana con datos normales:** la eficiencia asintótica de la mediana es $2/\pi \approx 0.637$.
- **Depende de la población:** con colas pesadas la mediana puede ser más eficiente que la media.
- **Cota de Cramér-Rao:** un estimador insesgado cuya varianza alcanza la cota es el más eficiente posible.

:::figura[Población exponencial: la media es mucho más eficiente que la mediana corregida para estimar la media.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: media-exponencial
estimadores: [media, mediana]
n: 20
theta: 2
```
:::

## Errores comunes

- **Invertir el cociente.** Por convención el numerador es el error del otro estimador; un valor mayor que 1 favorece al primero.
- **Generalizar de una población a otra.** La mediana pierde con datos normales y puede ganar con datos de colas pesadas.
- **Usarla con estimadores sesgados de forma distinta sin pensar en el ECM.** Para estimadores sesgados el cociente de varianzas no basta; se usan errores cuadráticos medios.

:::figura[Comparación con tres estimadores de la media normal: media, mediana y media recortada, esta última muy cercana a la media en eficiencia.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: media-normal
estimadores: [media, mediana, recortada]
n: 25
theta: 1
```
:::

## Conexiones

La eficiencia relativa compara el [[error-cuadratico-medio]] de dos estimadores; para insesgados, su [[varianza-de-un-estimador|varianza]]. Explica por qué la [[media-aritmetica]] suele preferirse a la [[mediana]] con datos normales y por qué la [[media-recortada]] es un buen compromiso.

## Formulario

:::formula[Eficiencia relativa]
$$
\operatorname{ef}(\hat{\theta}_1, \hat{\theta}_2) = \frac{\operatorname{ECM}(\hat{\theta}_2)}{\operatorname{ECM}(\hat{\theta}_1)}
$$

- $\hat{\theta}_1$, $\hat{\theta}_2$: estimadores comparados; $\operatorname{ECM}$: error cuadrático medio.
:::

:::formula[Eficiencia de la mediana frente a la media bajo normalidad]
$$
\lim_{n \to \infty} \frac{\operatorname{Var}(\bar{X})}{\operatorname{Var}(\tilde{X})} = \frac{2}{\pi} \approx 0.637
$$

- $\bar{X}$: media muestral; $\tilde{X}$: mediana muestral.
:::

:::formula[Ejemplo uniforme]
$$
\operatorname{ef}\Big(\frac{n+1}{n}X_{(n)},\ 2\bar{X}\Big) = \frac{n + 2}{3}
$$

- $X_{(n)}$: máximo de la muestra; $n$: tamaño.
:::
