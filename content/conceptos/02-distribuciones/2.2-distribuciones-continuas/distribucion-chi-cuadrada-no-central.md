---
id: distribucion-chi-cuadrada-no-central
titulo: Distribución chi-cuadrada no central
titulo_en: Noncentral chi-squared distribution
alias:
  - chi-cuadrada no central
  - ji cuadrada no central
  - χ² no central
modulo: 2
submodulo: '2.2'
orden: 28
nivel: avanzado
prerrequisitos:
  - distribucion-chi-cuadrada
relaciones:
  - tipo: generaliza
    id: distribucion-chi-cuadrada
etiquetas:
  - suma de cuadrados
  - no centralidad
  - potencia de pruebas
  - mezcla de Poisson
resumen: >
  Es la suma de cuadrados de k normales independientes con varianza 1 pero medias distintas de cero.
  El parámetro de no centralidad λ resume esas medias; describe la potencia de las pruebas ji cuadrada.
formula: 'Q = \sum_{i=1}^{k} (Z_i + m_i)^{2} \sim \chi^{2}_{k}(\lambda), \quad \lambda = \sum_{i=1}^{k} m_i^{2}'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: chi-cuadrada-no-central
      valores:
        k: 3
        lambda: 5
      dominio: [0, 40]
      casos:
        - nombre: 'Sin efecto'
          descripcion: 'λ = 0: es la chi-cuadrada central; describe el estadístico cuando la hipótesis nula es cierta.'
          valores: {k: 3, lambda: 0}
        - nombre: 'Efecto moderado'
          descripcion: 'λ = 5: las medias distintas de cero empujan la suma a la derecha; media 8 en lugar de 3.'
          valores: {k: 3, lambda: 5}
        - nombre: 'Efecto grande'
          descripcion: 'λ = 15: la distribución se aleja mucho del cero y se ensancha; casi siempre supera el valor crítico.'
          valores: {k: 3, lambda: 15}
      ejemplo:
        titulo: 'Potencia de una prueba'
        contexto: 'Una prueba ji cuadrada con 3 grados de libertad rechaza al 5 % cuando el estadístico supera 7.815. Bajo la alternativa de interés, el estadístico sigue una chi-cuadrada no central con λ = 5.'
        pregunta: '¿Qué probabilidad tiene la prueba de detectar el efecto, es decir, cuál es su potencia?'
        valores: {k: 3, lambda: 5}
        region: derecha
        desde: 7.815
      referencia:
        distribucion: chi-cuadrada
        valores: {k: 3}
        etiqueta: 'Chi-cuadrada central, bajo la nula'
        visible: true
    genesis:
      componente: ContinuousGenesis
      parametros:
        proceso: suma-cuadrados
        valores:
          k: 3
          m: 1.29
referencias:
  - clave: casella-berger
  - clave: agresti
publicado: true
---

## Intuición

Una prueba ji cuadrada suma cuadrados de desviaciones estandarizadas y rechaza la hipótesis nula si la suma es demasiado grande. Cuando la nula es cierta, cada desviación es una normal con media cero y la suma es una chi-cuadrada ordinaria. Pero si la nula es falsa, las desviaciones tienen medias distintas de cero: al elevarlas al cuadrado, esas medias empujan la suma hacia arriba. La distribución de esa suma desplazada es la chi-cuadrada no central.

Lo notable es que la distribución solo depende de las medias a través de un número: la suma de sus cuadrados, llamada parámetro de no centralidad. No importa si el efecto está concentrado en una sola coordenada o repartido entre todas; mientras la suma de cuadrados sea la misma, la distribución es la misma.

Su uso principal es calcular la potencia de una prueba: la probabilidad de que la chi-cuadrada no central supere el valor crítico, que se fija con la chi-cuadrada central. También aparece en el cuadrado de la amplitud de una señal con ruido, que es una Rice al cuadrado.

## Definición

:::definicion[Chi-cuadrada no central]
Si $Z_1, \dots, Z_k$ son normales estándar independientes y $m_1, \dots, m_k$ son constantes, la variable $Q = \sum_{i=1}^{k}(Z_i + m_i)^{2}$ tiene **distribución chi-cuadrada no central** con $k$ grados de libertad y no centralidad $\lambda = \sum_i m_i^{2}$, $Q \sim \chi^{2}_{k}(\lambda)$. Su densidad es una mezcla de Poisson de chi-cuadradas centrales:
$$
f(q) = \sum_{j=0}^{\infty} e^{-\lambda/2}\frac{(\lambda/2)^{j}}{j!}\, f_{\chi^{2}_{k + 2j}}(q).
$$
:::

:::nota[Qué significa cada símbolo]
- $Q$: suma de cuadrados.
- $Z_i$: normales estándar independientes.
- $m_i$: medias de cada término.
- $k$: grados de libertad.
- $\lambda$: no centralidad, suma de cuadrados de las medias.
- $j$: índice de la mezcla; los pesos son probabilidades de una Poisson de media $\lambda/2$.
- $f_{\chi^{2}_{k+2j}}$: densidad chi-cuadrada central con $k + 2j$ grados.
:::

## Cómo usar la visualización

La pestaña Distribución muestra la densidad no central junto a la chi-cuadrada central (línea punteada), la región elegida y su probabilidad; los casos cargan sin efecto, efecto moderado y efecto grande, y el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge suma cuadrados de normales con media distinta de cero.

Al aumentar $\lambda$ la densidad se desplaza a la derecha y se ensancha. La región desde 7.815, el valor crítico al 5 % con 3 grados, mide la potencia: 0.05 sin efecto, 0.44 con $\lambda = 5$ y 0.92 con $\lambda = 15$.

## Ejemplo

Una prueba ji cuadrada con 3 grados de libertad rechaza la nula al 5 % si el estadístico supera 7.815, el cuantil 0.95 de $\chi^{2}_{3}$. Bajo la alternativa que interesa detectar, el estadístico es $\chi^{2}_{3}(5)$.

1. Media del estadístico bajo la alternativa: $k + \lambda = 8$; varianza: $2(k + 2\lambda) = 26$.
2. Potencia: $P(\chi^{2}_{3}(5) > 7.815) \approx 0.44$.
3. La prueba detecta ese efecto en menos de la mitad de los estudios.
4. Con el triple de datos, la no centralidad se triplica a 15 y la potencia sube a 0.92.

:::figura[Potencia de la prueba: el área sombreada a la derecha de 7.815 bajo la no central vale 0.44; bajo la central (línea punteada) vale 0.05. El botón carga el ejemplo.]{componente="DistributionExplorer"}
```yaml
distribucion: chi-cuadrada-no-central
valores:
  k: 3
  lambda: 5
dominio: [0, 40]
ejemplo:
  titulo: 'Potencia de una prueba'
  contexto: 'Una prueba ji cuadrada con 3 grados rechaza cuando el estadístico supera 7.815; bajo la alternativa, el estadístico es no central con λ = 5.'
  pregunta: '¿Cuál es la potencia de la prueba?'
  valores: {k: 3, lambda: 5}
  region: derecha
  desde: 7.815
region: derecha
desde: 7.815
muestras: false
referencia:
  distribucion: chi-cuadrada
  valores:
    k: 3
  etiqueta: Chi-cuadrada central
```
:::

## Propiedades

- **Media y varianza:** $\mathbb{E}[Q] = k + \lambda$ y $\operatorname{Var}(Q) = 2(k + 2\lambda)$.
- **Solo importa λ:** la distribución depende de las medias únicamente por $\lambda = \sum m_i^{2}$.
- **Mezcla de Poisson:** $Q$ se obtiene sorteando $J \sim \operatorname{Poisson}(\lambda/2)$ y luego una $\chi^{2}_{k + 2J}$ central.
- **Caso λ = 0:** es la chi-cuadrada central.
- **Suma:** $\chi^{2}_{k_1}(\lambda_1) + \chi^{2}_{k_2}(\lambda_2) = \chi^{2}_{k_1 + k_2}(\lambda_1 + \lambda_2)$ para sumandos independientes.
- **Monotonía:** la probabilidad de superar cualquier umbral crece con $\lambda$; por eso la potencia aumenta con el tamaño del efecto.

:::figura[Tres casos con contexto (sin efecto, efecto moderado y efecto grande): cada botón carga la no centralidad y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: chi-cuadrada-no-central
valores:
  k: 3
  lambda: 5
dominio: [0, 40]
casos:
  - nombre: 'Sin efecto'
    descripcion: 'λ = 0: la chi-cuadrada central.'
    valores: {k: 3, lambda: 0}
  - nombre: 'Efecto moderado'
    descripcion: 'λ = 5: media 8.'
    valores: {k: 3, lambda: 5}
  - nombre: 'Efecto grande'
    descripcion: 'λ = 15: media 18, casi siempre supera 7.815.'
    valores: {k: 3, lambda: 15}
region: derecha
desde: 7.815
muestras: false
```
:::

:::figura[Cuadrados de normales con media 1.29 en cada eje: λ = 3 · 1.29² ≈ 5. El histograma se separa de la chi-cuadrada central (línea punteada).]{componente="ContinuousGenesis"}
```yaml
proceso: suma-cuadrados
valores:
  k: 3
  m: 1.29
comparar: true
```
:::

## Errores comunes

- **Confundir convenciones de λ.** Algunos textos definen la no centralidad como $\lambda/2$ o como $\sqrt{\lambda}$; hay que revisar antes de usar tablas o programas.
- **Fijar el valor crítico con la no central.** El valor crítico se fija con la distribución bajo la nula, la central; la no central solo sirve para la potencia.
- **Pensar que da igual el tamaño de muestra.** La no centralidad crece proporcionalmente con el tamaño de muestra para un efecto fijo.
- **Olvidar que las varianzas deben ser 1.** Si los términos tienen otra varianza hay que estandarizarlos antes.

:::figura[El valor crítico viene de la central: el cuantil 0.95 de la chi-cuadrada con 3 grados es 7.815.]{componente="DistributionExplorer"}
```yaml
distribucion: chi-cuadrada
valores:
  k: 3
dominio: [0, 20]
vista: acumulada
probabilidad: 0.95
muestras: false
```
:::

## Conexiones

La chi-cuadrada no central generaliza la [[distribucion-chi-cuadrada]] y se escribe como mezcla de chi-cuadradas con pesos de la [[distribucion-de-poisson]]. El cuadrado de una [[distribucion-de-rice]] reescalada es una no central con dos grados. El cociente de una no central entre una central da la F no central, usada para la potencia del análisis de varianza, y su análogo para medias es la [[distribucion-t-no-central]].

## Formulario

:::formula[Construcción]
$$
Q = \sum_{i=1}^{k}(Z_i + m_i)^{2}, \qquad \lambda = \sum_{i=1}^{k} m_i^{2}
$$

- $Z_i$: normales estándar; $m_i$: medias.
- $k$: grados de libertad.
:::

:::formula[Mezcla de Poisson]
$$
f(q) = \sum_{j=0}^{\infty} e^{-\lambda/2}\frac{(\lambda/2)^{j}}{j!}\, f_{\chi^{2}_{k + 2j}}(q)
$$

- $j$: índice de la mezcla.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[Q] = k + \lambda, \qquad \operatorname{Var}(Q) = 2(k + 2\lambda)
$$

- Con $\lambda = 0$ se recupera la central.
:::

:::formula[Potencia de una prueba]
$$
\text{potencia} = P\big(\chi^{2}_{k}(\lambda) > c\big), \qquad c = \chi^{2}_{k;\,1 - \alpha}
$$

- $c$: valor crítico de la central.
- $\alpha$: nivel de significancia.
:::
